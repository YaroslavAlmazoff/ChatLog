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
const types = require("./public_notification_types");

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

    res.json(JSON.stringify({ public: newPublic }));
  }
  async edit(req, res) {
    const { id, name, description, category, admin } = req.body;
    const exists = await Public.findOne({ name });
    if (exists) {
      res.json({ error: "Имя группы должно быть уникальным" });
      return;
    }
    const avatarUrl = uuid.v4() + ".jpg";
    const bannerUrl = uuid.v4() + ".jpg";
    if (req.files) {
      if (req.files.avatar) {
        FileService.insertPublicAvatar(req.files.avatar, avatarUrl);
        await Public.findByIdAndUpdate(id, {
          avatarUrl,
          name,
          description,
          category,
          admin,
        });
      }
      if (req.files.banner) {
        FileService.insertPublicBanner(req.files.banner, bannerUrl);
        await Public.findByIdAndUpdate(id, {
          bannerUrl,
          name,
          description,
          category,
          admin,
        });
      }
    }
    res.json({ url: "-_-" });
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

    res.json({ msg: "" });
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
    await PublicPost.findByIdAndDelete(req.params.id);
    res.json("deleted");
  }
  async postHead(req, res) {
    const post = await PublicPost.findById(req.params.id);
    const pub = await Public.findById(post.public);
    res.json({ name: pub.name, avatarUrl: pub.avatarUrl, id: pub._id });
  }

  async likePost(req, res) {
    const userid = req.user.userId;
    const id = req.params.id;
    const pub = req.params.public;

    const like = await Like.findOne({ user: userid, post: id });

    const needArticle = await PublicPost.findById(id);
    let likes = needArticle.likes;

    if (like) {
      const newLikes = likes - 1;
      await PublicPost.findByIdAndUpdate(id, { likes: newLikes });
      await Like.findOneAndDelete({ user: userid, post: id });
      await this.notify(types.like, userid, req.params.id, public);
      res.json({ liked: false });
    } else {
      const newLikes = 1 + likes;
      await PublicPost.findByIdAndUpdate(id, { likes: newLikes });
      await Like.create({ user: userid, post: id });
      await this.notify(types.dislike, userid, req.params.id, public);
      res.json({ liked: true });
    }
  }
  async likeComment(req, res) {
    const comment = await Comment.findById(req.params.id);
    const likes = comment.likes + 1;
    await Comment.findByIdAndUpdate(req.params.id, { likes });
    res.json({ msg: "liked" });
  }
  async dislikePost(req, res) {
    const post = await PublicPost.findById(req.params.id);
    const likes = post.likes - 1;
    await PublicPost.findByIdAndUpdate(req.params.id, { likes });
    res.json({ msg: "disliked" });
  }
  async dislikeComment(req, res) {
    const comment = await Comment.findById(req.params.id);
    const likes = comment.likes - 1;
    await Comment.findByIdAndUpdate(req.params.id, { likes });
    res.json({ msg: "disliked" });
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
        req.params.id,
        public,
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
  async notify(type, userId, publicId, postId, text) {
    const post = await PublicPost.findById(postId);
    const user = await User.findById(userId);
    let text = `${user.name} ${user.surname} ${type} запись ${post.title}`;
    if (type === types.subscribe) {
      text = `${user.name} ${user.surname} ${type} на ваш канал`;
    } else if (type === types.unscribe) {
      text = `${user.name} ${user.surname} ${type}`;
    } else if (type === types.dislike) {
      text = `${user.name} ${user.surname} ${type} с записи ${post.title}`;
    } else if (type === types.comment) {
      text = `${user.name} ${user.surname} ${type} запись ${post.title}: ${text}`;
    }
    await PublicNotification.create({ text, public: publicId });
  }
}

module.exports = new PublicService();
