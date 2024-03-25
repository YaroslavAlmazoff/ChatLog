const Public = require("../models/Public");
const uuid = require("uuid");
const Notification = require("../models/Notification");
const FileService = require("./FileService");
const PublicPost = require("../models/PublicPost");
const User = require("../models/User");
const Comment = require("../models/PublicComment");
const PublicNotification = require("../models/PublicNotification");
const ChatRoom = require("../models/ChatRoom");
const Like = require("../models/Like");
const ReactionsService = require("./ReactionsService");
const PublicComment = require("../models/PublicComment");
const NotificationToken = require("../models/NotificationToken");
const FirebaseService = require("../services/FirebaseService");
const types = require("./public_notification_types");
const path = require("path");
const ImageService = require("./ImageService");

class PublicService {
  async all(req, res) {
    const publics = await Public.find({});
    const finalPublics = publics.map((value) => {
      const publicObject = value.toObject();
      const isSubscriber = [];
      value.subscribers.forEach((el) => {
        if (el.toString() == req.params.id.toString()) {
          isSubscriber.push(req.params.id.toString());
        }
      });
      publicObject.isSubscriber = !!isSubscriber.length;
      if (!publicObject.avatarUrl) publicObject.avatarUrl = "";
      if (!publicObject.bannerUrl) publicObject.bannerUrl = "";
      return publicObject;
    });
    Promise.all(finalPublics)
      .then((data) => res.json({ publics: data }))
      .catch(() => res.json({ publics: [] }));
  }
  async publics(req, res) {
    const publics = await Public.find({});
    res.json({ publics });
  }
  async create(req, res) {
    const admin = req.user.userId;
    const { name, description } = req.body;
    const exists = await Public.findOne({ name });
    if (exists) {
      res.json({ error: "Имя группы должно быть уникальным" });
      return;
    }
    const avatarUrl = uuid.v4() + ".jpg";
    const bannerUrl = uuid.v4() + ".jpg";

    const newPublic = await Public.create({ name, description, admin });

    if (req.files) {
      if (req.files.avatar) {
        await Public.findOneAndUpdate({ name }, { avatarUrl });
        FileService.insertPublicAvatar(req.files.avatar, avatarUrl);
        await ChatRoom.create({
          creator: admin,
          title: name,
          avatarUrl,
          members: [admin],
        });
        FileService.insertChatAvatar(req.files.avatar, avatarUrl);
      } else {
        await ChatRoom.create({
          creator: admin,
          title: name,
          members: [admin],
        });
      }
      if (req.files.banner) {
        await Public.findOneAndUpdate({ name }, { bannerUrl });
        FileService.insertPublicBanner(req.files.banner, bannerUrl);
      }
    } else {
      await ChatRoom.create({ creator: admin, title: name, members: [admin] });
    }
    const pubObj = newPublic.toObject();
    res.json(JSON.stringify({ public: { ...pubObj, avatarUrl, bannerUrl } }));
  }
  async edit(req, res) {
    const { name, description, category, admin, avatar, banner } = req.body;
    console.log(name, description);
    const id = req.params.id;
    const p = await Public.findById(id);
    const pub = p.toObject();

    const avatarUrl = uuid.v4() + ".jpg";
    const bannerUrl = uuid.v4() + ".jpg";
    if (req.files) {
      if (req.files.avatar && Number(avatar)) {
        FileService.insertPublicAvatar(req.files.avatar, avatarUrl);
        await Public.findByIdAndUpdate(id, {
          avatarUrl,
          name,
          description,
          category,
          admin,
        });
      }
      if (req.files.banner && Number(banner)) {
        FileService.insertPublicBanner(req.files.banner, bannerUrl);
        await Public.findByIdAndUpdate(id, {
          bannerUrl,
          name,
          description,
          category,
          admin,
        });
      }
    } else {
      await Public.findByIdAndUpdate(id, {
        name,
        description,
        category,
        admin,
      });
    }

    pub.name = name;
    pub.description = description;
    pub.avatarUrl = Number(avatar) ? avatarUrl : pub.avatarUrl;
    pub.bannerUrl = Number(banner) ? bannerUrl : pub.bannerUrl;

    res.json(JSON.stringify(pub));
  }
  async createFoto(req, res) {
    const id = req.params.id;
    const filename = uuid.v4() + "." + res.files.foto.ext;
    FileService.insertPublicFoto(req.files.foto, filename);
    const pub = await Public.findById(id);
    const fotos = pub.fotos;
    fotos.push(filename);
    await Public.findByIdAndUpdate(id, { fotos });
    res.json({ msg: "success created foto" });
  }
  async createPost(req, res) {
    const { title, text, date } = req.body;

    const getImages = () => {
      if (req.files) {
        return Object.keys(req.files).map((file) => {
          const filename = uuid.v4() + ".jpg";
          return filename;
        });
      } else {
        return [];
      }
    };

    const images = getImages();
    PublicPost.create({
      title,
      text,
      date,
      images,
      public: req.params.id,
    }).then(async () => {
      const post = await PublicPost.findOne({
        title,
        text,
        date,
        public: req.params.id,
      });
      const pub = await Public.findById(req.params.id);
      pub.subscribers.forEach(async (el) => {
        const user = await User.findById(el);
        const publicNews = user.publicNews;
        publicNews.unshift(post._id);
        await User.findByIdAndUpdate(el, { publicNews });
      });
    });

    if (req.files) {
      Object.keys(req.files).forEach((file, i) => {
        FileService.insertPublicPost(req.files[file], images[i]);
      });
    }

    const pub = await Public.findById(req.params.id);

    res.json(JSON.stringify(pub));
  }
  async public(req, res) {
    const pub = await Public.findById(req.params.id);
    res.json({ pub });
  }
  async firstFotos(req, res) {
    const pub = await Public.findById(req.params.id);
    const fotos = pub.fotos.slice(pub.fotos.length - 6);
    res.json({ fotos });
  }
  async allFotos(req, res) {
    const pub = await Public.findById(req.params.id);
    res.json({ fotos: pub.fotos });
  }
  async post(req, res) {
    const post = await PublicPost.findById(id);
    res.json({ post });
  }
  async posts(req, res) {
    const posts = await PublicPost.find({ public: req.params.id });
    res.json({ posts });
  }
  async postsMobile(req, res) {
    const posts = await PublicPost.find({ public: req.params.id });
    const finalPosts = posts.map(async (post) => {
      const like = await Like.findOne({
        post: post._id,
        user: req.params.user,
      });
      const postObj = post.toObject();
      postObj.liked = !!like;
      return postObj;
    });

    Promise.all(finalPosts)
      .then((data) => res.json({ posts: data }))
      .catch((err) => res.json({ posts: [], err }));
  }
  async firstSubscribers(req, res) {
    const pub = await Public.findById(req.params.id);
    const subscribers = pub.subscribers.slice(
      pub.subscribers.length - 6,
      pub.subscribers.length
    );
    res.json({ subscribers });
  }
  async allSubscribers(req, res) {
    const pub = await Public.findById(req.params.id);
    res.json({ subscribers: pub.subscribers });
  }
  async subscribers(req, res) {
    const pub = await Public.findById(req.params.id);
    const finalSubscribers = pub.subscribers.map(async (value) => {
      const user = await User.findById(value);
      return user;
    });
    Promise.all(finalSubscribers)
      .then((data) => res.json({ subscribers: data }))
      .catch(() => res.json({ subscribers: [] }));
  }
  async subscribe(req, res) {
    const pub = await Public.findById(req.params.id);
    const subscribers = pub.subscribers;
    const isSubscriber = [];
    subscribers.forEach((el) => {
      if (el.toString() == req.user.userId.toString()) {
        isSubscriber.push(req.user.userId.toString());
      }
    });
    if (isSubscriber.length) {
      const index = subscribers.findIndex((el) => {
        console.log(
          "!!!",
          el,
          el.toString(),
          req.user.userId,
          req.user.userId.toString(),
          el.toString() == req.user.userId.toString()
        );
        return el.toString() == req.user.userId.toString();
      });
      subscribers.splice(index, 1);
      await Public.findByIdAndUpdate(req.params.id, { subscribers });
      await this.notify(types.unscribe, req.user.userId, req.params.id, null);

      res.json({ isSubscriber: false });
    } else {
      subscribers.push(req.user.userId);
      await Public.findByIdAndUpdate(req.params.id, { subscribers });
      await this.notify(types.subscribe, req.user.userId, req.params.id, null);
      console.log(isSubscriber, false);
      res.json({ isSubscriber: true });
    }
  }
  async subscribe(req, res) {
    const pub = await Public.findById(req.params.id);
    const user = await User.findById(req.user.userId);

    const subscribers = pub.subscribers;
    const subscribes = user.subscribes;
    const isSubscriber = [];
    subscribers.forEach((el) => {
      if (el.toString() == req.user.userId.toString()) {
        isSubscriber.push(req.user.userId.toString());
      }
    });
    if (isSubscriber.length) {
      const index = subscribers.findIndex((el) => {
        return el.toString() == req.user.userId.toString();
      });
      const subscribeIndex = user.subscribes.findIndex((el) => {
        return el.toString() == req.params.id.toString();
      });
      subscribers.splice(index, 1);
      subscribes.splice(subscribeIndex, 1);
      await Public.findByIdAndUpdate(req.params.id, { subscribers });
      await User.findByIdAndUpdate(req.user.userId, { subscribes });
      await this.notify(types.unscribe, req.user.userId, req.params.id, null);

      res.json({ isSubscriber: false });
    } else {
      subscribers.push(req.user.userId);
      subscribes.push(req.params.id);
      await Public.findByIdAndUpdate(req.params.id, { subscribers });
      await User.findByIdAndUpdate(req.user.userId, { subscribes });
      await this.notify(types.subscribe, req.user.userId, req.params.id, null);
      console.log(isSubscriber, false);
      res.json({ isSubscriber: true });
    }
  }
  async subscribes(req, res) {
    const { subscribes } = await User.findById(req.params.id);
    const userSubscribes = subscribes.map(
      async (item) => await Public.findById(item)
    );
    Promise.all(userSubscribes).then((data) => res.json({ subscribes: data }));
  }
  async subscribeListMobile(req, res) {
    const pub = await Public.findById(req.params.id);
    const subscribers = pub.subscribers;
    const isSubscriber = req.params.subscribed;
    if (isSubscriber == "1") {
      const index = subscribers.findIndex((el) => {
        return el.toString() == req.user.userId.toString();
      });
      subscribers.splice(index, 1);
      await Public.findByIdAndUpdate(req.params.id, { subscribers });
      res.json({ isSubscriber: false });
    } else {
      subscribers.push(req.user.userId);
      await Public.findByIdAndUpdate(req.params.id, { subscribers });
      console.log(isSubscriber, false);
      res.json({ isSubscriber: true });
    }
  }
  async isSubscriber(req, res) {
    const pub = await Public.findById(req.params.id);
    const subscribers = pub.subscribers;
    const isSubscriber = [];
    subscribers.forEach((el) => {
      if (el.toString() == req.user.userId.toString()) {
        isSubscriber.push(req.user.userId);
      }
    });
    if (isSubscriber.length) {
      res.json({ isSubscriber: true });
    } else {
      res.json({ isSubscriber: false });
    }
  }
  async deletePost(req, res) {
    const post = await PublicPost.findById(req.params.id);
    const filepathes = post.images.map((el) =>
      path.resolve("..", "static", "publicposts", el)
    );

    filepathes.forEach((el) => {
      ImageService.deleteFile(el);
    });
    await post.delete();
    res.json("deleted");
  }
  async postHead(req, res) {
    const post = await PublicPost.findById(req.params.id);
    const pub = await Public.findById(post.public);
    res.json({ name: pub.name, avatarUrl: pub.avatarUrl, id: pub._id });
  }

  async likePost(req, res) {
    try {
      //Получение ID поста
      const { id, pub } = req.params;
      //Получение ID пользователя
      const userid = req.user.userId;

      const like = await Like.findOne({ user: userid, post: id });
      const needArticle = await PublicPost.findById(id);
      let likes = needArticle.likes;

      if (like) {
        //Дизлайк
        const newLikes = likes - 1;
        const post = await PublicPost.findByIdAndUpdate(id, {
          likes: newLikes,
        });
        await Like.findOneAndDelete({ user: userid, post: id });

        if (post.user != userid) {
          await this.notify(types.like, userid, pub, req.params.id);
        }
        res.json({ liked: false });
      } else {
        //Лайк
        const newLikes = 1 + likes;
        const post = await PublicPost.findByIdAndUpdate(id, {
          likes: newLikes,
        });
        if (post.user != userid) {
          await this.notify(types.dislike, userid, pub, req.params.id);
        }
        await Like.create({ user: userid, post: id });
        res.json({ liked: true });
      }
    } catch (e) {
      console.log(e);
    }
  }
  async likeComment(req, res) {
    const comment = await Comment.findById(req.params.id);
    const like = await Like.findOne({
      user: req.user.userId,
      post: comment._id,
    });
    if (like) {
      const likes = comment.likes - 1;
      await Comment.findByIdAndUpdate(req.params.id, { likes });
      res.json({ msg: "disliked" });
    } else {
      const likes = comment.likes + 1;
      await Comment.findByIdAndUpdate(req.params.id, { likes });
      res.json({ msg: "liked" });
    }
  }
  async comment(req, res) {
    const { text, date, pub } = req.body;
    Comment.create({
      text,
      date,
      postID: req.params.id,
      user: req.user.userId,
    }).then(async (comment) => {
      const post = await PublicPost.findById(req.params.id);
      const comments = post.comments + 1;
      await PublicPost.findByIdAndUpdate(req.params.id, { comments });
      const user = await User.findById(req.user.userId);
      const commentObj = comment.toObject();
      commentObj.userName = user.name + " " + user.surname;
      commentObj.avatarUrl = user.avatarUrl;

      await this.notify(
        types.comment,
        req.user.userId,
        pub,
        req.params.id,
        text
      );
      res.json({ comment: commentObj });
    });
  }
  async deleteComment(req, res) {
    const comment = await Comment.findById(req.params.id);
    await Comment.findByIdAndDelete(req.params.id);
    const post = await PublicPost.findById(comment.postID);
    const comments = post.comments - 1;
    await PublicPost.findByIdAndUpdate(req.params.id, { comments });
    res.json({ msg: "deleted" });
  }
  async comments(req, res) {
    const comments = await PublicComment.find({ postID: req.params.id });
    comments.length && console.log(comments);
    const fullComments = comments.map(async (el) => {
      const user = await User.findById(el.user);
      if (user == null) return null;
      const commentObj = el.toObject();
      commentObj.userName = user.name + " " + user.surname;
      commentObj.avatarUrl = user.avatarUrl;
      return commentObj;
    });
    Promise.all(fullComments)
      .then((cms) => {
        const filtered = cms.filter((item) => item != null);
        res.json({ comments: filtered });
      })
      .catch(() => {
        res.json({ comments: [] });
      });
  }

  async getNotifications(req, res) {
    const notifications = await PublicNotification.find({
      public: req.params.id,
    });
    res.json({ notifications });
  }
  async notify(type, userId, publicId, postId, message) {
    const post = await PublicPost.findById(postId);
    const user = await User.findById(userId);
    const pub = await Public.findById(publicId);
    let text = ``;
    if (type === types.subscribe) {
      text = `${user.name} ${user.surname} ${type} на ваш канал`;
    } else if (type === types.unscribe) {
      text = `${user.name} ${user.surname} ${type}`;
    } else if (type === types.dislike) {
      text = `${user.name} ${user.surname} ${type} с записи ${post.title}`;
    } else if (type === types.comment) {
      text = `${user.name} ${user.surname} ${type} запись ${post.title}: ${message}`;
    } else {
      text = `${user.name} ${user.surname} ${type} запись ${post.title}`;
    }
    const token = await NotificationToken.findOne({ user: pub.admin });
    FirebaseService.send(text, "", token.token, {
      id: userId,
      type: "public",
      message: text,
      name: "",
      click_action: "USER",
    });
    await PublicNotification.create({ text, public: publicId });
  }
}

module.exports = new PublicService();
