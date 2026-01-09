const User = require("../models/User.js");
const UserFoto = require("../models/UserFoto.js");
const UserPost = require("../models/UserPost.js");
const UserVideo = require("../models/UserVideo.js");
const NotificationService = require("./NotificationService.js");
const NotificationToken = require("../models/NotificationToken");
const FirebaseService = require("../services/FirebaseService");
const Comment = require("../models/Comment");
const Like = require("../models/Like.js");

//Сервис для количества лайков и комментариев
class ReactionService {
  //Увеличение количества лайков
  async checkLike(req, res) {
    const like = await Like.findOne({
      user: req.user.userId,
      post: req.params.id,
    });
    if (like != null) {
      res.json({ liked: true });
    } else {
      res.json({ liked: false });
    }
  }
  async like(req, res) {
    try {
      //Получение ID поста
      const { id } = req.params;
      //Получение ID пользователя
      const userid = req.user.userId;

      const like = await Like.findOne({ user: userid, post: id });

      const user = await User.findById(userid);
      //Поиск поста
      const needArticle = await UserPost.findById(id);
      let likes = needArticle.likes;
      let likers = needArticle.likers;

      if (like) {
        //Дизлайк
        delete likers[likers.indexOf(userid)];
        likers = likers.filter((el) => el !== null);
        const newLikes = likes - 1;
        const post = await UserPost.findByIdAndUpdate(id, {
          likes: newLikes,
          likers,
        });
        await Like.findOneAndDelete({ user: userid, post: id });

        if (post.user != userid) {
          const text = `Ваша публикация не понравилась пользователю ${user.name} ${user.surname}.`;
          await NotificationService.create(
            userid,
            needArticle.user,
            text,
            "like",
            "article",
            id
          );

          //Возвращение нового количества лайков
          const token = await NotificationToken.findOne({ user: post.user });
          FirebaseService.send(text, "", token.token, {
            id: post._id.toString(),
            type: "like",
            message: text,
            name: "",
            click_action: "POST",
          });
        }
        res.json({ liked: false });
      } else {
        //Лайк
        likers.push(userid);
        const newLikes = 1 + likes;
        const post = await UserPost.findByIdAndUpdate(id, {
          likes: newLikes,
          likers,
        });
        if (post.user != userid) {
          const text = `Ваша публикация понравилась пользователю ${user.name} ${user.surname}.`;
          await NotificationService.create(
            userid,
            needArticle.user,
            text,
            "like",
            "article",
            id
          );
          //Возвращение обновлённого количества лайков на клиент

          const token = await NotificationToken.findOne({ user: post.user });
          FirebaseService.send(text, "", token.token, {
            id: post._id.toString(),
            type: "like",
            message: text,
            name: "",
            click_action: "POST",
          });
        }
        await Like.create({ user: userid, post: id });
        res.json({ liked: true });
      }
    } catch (e) {
      console.log(e);
    }
  }

  //Увеличение количества комментариев
  async comment(req, res) {
    try {
      const { id } = req.body;
      const needArticle = await UserPost.findById(id);
      let comms = needArticle.comments;
      const newComms = 1 + comms;
      const itog = await UserPost.findByIdAndUpdate(id, { comments: newComms });
      res.json({ itog });
    } catch (e) {
      console.log(e);
    }
  }
  async commentUserPost(req, res) {
    const { text, date } = req.body;
    Comment.create({
      comment: text,
      date,
      user: req.user.userId,
      articleID: req.params.id,
    }).then(async (comment) => {
      const post = await UserPost.findById(req.params.id);
      const comments = post.comments + 1;
      await UserPost.findByIdAndUpdate(req.params.id, { comments });
      const user = await User.findById(req.user.userId);
      const commentObj = comment.toObject();
      commentObj.userName = user.name + " " + user.surname;
      commentObj.avatarUrl = user.avatarUrl;
      const note = `Вашу запись прокомментировал пользователь ${user.name} ${user.surname}: ${text}`;
      await NotificationService.create(
        req.user.userId,
        post.user,
        note,
        "comment",
        "article",
        ""
      );
      const token = await NotificationToken.findOne({ user: post.user });
      console.log(text, "", token.token, {
        id: post._id,
        type: "comment",
        message: text,
        name: "",
        click_action: "POST",
      });
      FirebaseService.send(text, "", token.token, {
        id: user._id.toString(),
        type: "comment",
        message: text,
        name: "",
        click_action: "POST",
      });
      res.json({ comment: commentObj });
    });
  }
  async deleteUserComment(req, res) {
    const comment = await Comment.findById(req.params.id);
    await Comment.findByIdAndDelete(req.params.id);
    const post = await UserPost.findById(comment.postID);
    const comments = post.comments - 1;
    await UserPost.findByIdAndUpdate(req.params.id, { comments });
    res.json({ msg: "deleted" });
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
      await Like.findOneAndDelete({
        user: req.user.userId,
        post: req.params.id,
      });
      res.json({ liked: false });
    } else {
      const likes = comment.likes + 1;
      await Comment.findByIdAndUpdate(req.params.id, { likes });
      await Like.create({ user: req.user.userId, post: req.params.id });
      res.json({ liked: true });
    }
  }
  async comments(req, res) {
    const comments = await Comment.find({ articleID: req.params.id });
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

  async likeFoto(req, res) {
    const { sub } = req.body;
    const userid = req.user.userId;
    const user = await User.findById(userid);
    const fotourl = req.params.url;
    const foto = await UserFoto.findOne({ imageUrl: fotourl });

    let likers = foto.likers;
    const likes = foto.likes;
    if (sub) {
      //Дизлайк
      delete likers[likers.indexOf(userid)];
      likers = likers.filter((el) => el !== null);
      const newLikes = likes - 1;
      const updated = await UserFoto.updateOne(
        { imageUrl: fotourl },
        { likes: newLikes, likers }
      );
      //Возвращение нового количества лайков
      res.json({ updated });
    } else {
      //Лайк
      likers.push(userid);
      const newLikes = 1 + likes;
      const updated = await UserFoto.updateOne(
        { imageUrl: fotourl },
        { likes: newLikes, likers }
      );
      const text = `Ваша публикация понравилась полюзователю ${user.name} ${user.surname}.`;
      NotificationService.create(
        userid,
        foto.user,
        text,
        "like",
        "fotorgraphy",
        fotourl
      );
      //Возвращение обновлённого количества лайков на клиент
      res.json({ updated });
    }
  }
  async likeVideo(req, res) {
    const { sub, id } = req.body;
    const userid = req.user.userId;
    const user = await User.findById(userid);
    const video = await UserVideo.findById(id);

    let likers = video.likers;
    const likes = video.likes;
    if (sub) {
      //Дизлайк
      delete likers[likers.indexOf(userid)];
      likers = likers.filter((el) => el !== null);
      const newLikes = likes - 1;
      const updated = await UserVideo.findByIdAndUpdate(id, {
        likes: newLikes,
        likers,
      });
      //Возвращение нового количества лайков
      res.json({ updated });
    } else {
      //Лайк
      likers.push(userid);
      const newLikes = 1 + likes;
      const updated = await UserVideo.findByIdAndUpdate(id, {
        likes: newLikes,
        likers,
      });
      const text = `Ваша публикация понравилась полюзователю ${user.name} ${user.surname}.`;
      NotificationService.create(userid, video.user, text, "like", "video", id);
      //Возвращение обновлённого количества лайков на клиент
      res.json({ updated });
    }
  }
  async plusFotoComm(req, res) {
    try {
      //Получение ID фото
      const url = req.params.url;
      //Поиск фото
      const needArticle = await UserFoto.findOne({ imageUrl: url });
      let comms = needArticle.comments;
      //Новый комментарий
      const newComms = 1 + comms;
      //Обновление количества комментариев
      const updated = await UserFoto.updateOne(
        { imageUrl: url },
        { comments: newComms }
      );
      //Возвращение обновлённого количества комментариев на клиент
      res.json({ updated });
    } catch (e) {
      console.log(e);
    }
  }
  async plusVideoComm(req, res) {
    try {
      //Получение ID фото
      const url = req.params.url;
      //Поиск фото
      const needArticle = await UserVideo.findOne({ imageUrl: url });
      let comms = needArticle.comments;
      //Новый комментарий
      const newComms = 1 + comms;
      //Обновление количества комментариев
      const updated = await UserVideo.updateOne(
        { imageUrl: url },
        { comments: newComms }
      );
      //Возвращение обновлённого количества комментариев на клиент
      res.json({ updated });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new ReactionService();
