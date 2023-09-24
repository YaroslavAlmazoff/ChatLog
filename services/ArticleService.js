const UserPost = require("../models/UserPost.js");
const FileService = require("../services/FileService.js");
const uuid = require("uuid");
const path = require("path");
const ImageService = require("./ImageService.js");
const User = require("../models/User.js");
const NewsService = require("./NewsService.js");
const Like = require("../models/Like.js");

//Сервис постов пользователя
class ArticleService {
  //Создание поста пользователя
  async createUserPost(req, res) {
    const { title, date } = req.body;

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
    UserPost.create({ title, date, images, user: req.user.userId }).then(
      async (data) => {
        const user = await User.findById(req.user.userId);
        user.friends.forEach(async (el) => {
          const friend = await User.findById(el);
          const friendsNews = friend.friendsNews;
          friendsNews.unshift(data._id);
          await User.findByIdAndUpdate(el, { friendsNews });
        });
      }
    );

    if (req.files) {
      Object.keys(req.files).forEach((file, i) => {
        FileService.insertUserPostImage(req.files[file], images[i]);
      });
    }

    res.json("");
  }
  //Получение всех постов пользователя
  async getUserPosts(req, res) {
    //Получение ID пользователя из параметров
    const user = req.params.id;
    //Поиск постов
    const articles = await UserPost.find({ user });
    //Возвращение на клиент посты пользователя
    res.json({ articles });
  }
  async getUserPostsMobile(req, res) {
    const user = await User.findById(req.params.id);
    const userPosts = await UserPost.find({ user: req.params.id });
    const posts = userPosts.map(async (el) => {
      const postObj = el.toObject();
      const liked = await Like.findOne({ user: req.params.id, post: el._id });
      postObj.userName = user.name + " " + user.surname;
      postObj.avatar = user.avatarUrl;
      postObj.liked = !!liked;
      return postObj;
    });
    Promise.all(posts)
      .then((userposts) => {
        const filtered = userposts.filter((item) => item != null).reverse();
        res.json({ posts: filtered });
      })
      .catch(() => {
        res.json({ posts: [] });
      });
  }
  //Удаление поста пользователя
  async deleteUserPost(req, res) {
    console.log("here");
    const post = await UserPost.findById(req.params.id);
    console.log(post);
    const images = post.images;
    await UserPost.findByIdAndDelete(req.params.id);
    const filepathes = images.map((el) =>
      path.resolve("..", "static", "articles", el)
    );

    filepathes.forEach((el) => {
      ImageService.deleteFile(el);
    });
    res.json({ message: "Запись удалена." });
  }
  async postHead(req, res) {
    const post = await UserPost.findById(req.params.id);
    const user = await User.findById(post.user);
    res.json({
      name: user.name,
      surname: user.surname,
      avatarUrl: user.avatarUrl,
      id: user._id,
    });
  }
}

module.exports = new ArticleService();
