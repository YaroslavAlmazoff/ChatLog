const PublicPost = require("../models/PublicPost");
const User = require("../models/User");
const UserPost = require("../models/UserPost");
const Public = require("../models/Public");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const PublicComment = require("../models/PublicComment");

class NewsService {
  async getPublicNews(req, res) {
    const user = await User.findById(req.user.userId);
    const news = user.publicNews;
    const fullNews = news.map(async (item) => {
      const post = await PublicPost.findById(item);
      if (post == null) return null;
      const pub = await Public.findById(post.public);
      const comments = await PublicComment.find({ postID: post._id });
      const liked = await Like.findOne({ user: req.user.userId, post: item });
      const postObj = post.toObject();
      postObj.publicName = `${pub.name}`;
      postObj.avatar = pub.avatarUrl;
      postObj.liked = !!liked;
      postObj.admin = pub.admin;
      postObj.comments = comments;
      return postObj;
    });
    Promise.all(fullNews)
      .then((data) => {
        const filtered = data.filter((item) => item != null);
        res.json({ posts: filtered });
      })
      .catch(() => {
        res.json({ posts: [] });
      });
  }

  async getPublicNewsPost(req, res) {
    const post = await PublicPost.findById(req.params.id);
    if (post) {
      res.json({ post });
    } else {
      res.json({ post: null });
    }
  }
  async getFriendsNews(req, res) {
    const user = await User.findById(req.user.userId);
    const news = user.friendsNews;
    const fullNews = news.map(async (item) => {
      const post = await UserPost.findById(item);
      if (post == null) return null;
      const owner = await User.findById(post.user);
      const comments = await Comment.find({ articleID: post._id });
      const liked = await Like.findOne({ user: req.user.userId, post: item });
      const postObj = post.toObject();
      postObj.name = owner.name + " " + owner.surname;
      postObj.avatar = owner.avatarUrl;
      postObj.liked = !!liked;
      postObj.comments = comments;
      return postObj;
    });
    Promise.all(fullNews)
      .then((data) => {
        const filtered = data.filter((item) => item != null);
        res.json({ posts: filtered });
      })
      .catch(() => {
        res.json({ posts: [] });
      });
  }
  async fullUserPublicNews(req, res) {
    const user = await User.findById(req.params.id);
    const publicNews = user.publicNews;
    const fullPublicNews = publicNews.map(async (el) => {
      const post = await PublicPost.findById(el);
      if (post == null) return null;
      const pub = await Public.findById(post.public);
      const liked = await Like.findOne({ user: req.params.id, post: el });
      const postObj = post.toObject();
      postObj.publicName = `${pub.name}`;
      postObj.avatar = pub.avatarUrl;
      postObj.liked = !!liked;
      postObj.admin = pub.admin;
      return postObj;
    });
    Promise.all(fullPublicNews)
      .then((fpn) => {
        const filtered = fpn.filter((item) => item != null);
        res.json({ news: filtered });
      })
      .catch(() => {
        res.json({ news: [] });
      });
  }
  async fullUserFriendsNews(req, res) {
    const user = await User.findById(req.params.id);
    const friendsNews = user.friendsNews;
    const fullFriendsNews = friendsNews.map(async (el) => {
      const post = await UserPost.findById(el);
      if (post == null) return null;
      const user = await User.findById(post.user);
      const liked = await Like.findOne({ user: req.params.id, post: el });
      const postObj = post.toObject();
      postObj.userName = `${user.name} ${user.surname}`;
      postObj.avatar = user.avatarUrl;
      postObj.liked = !!liked;
      return postObj;
    });
    Promise.all(fullFriendsNews)
      .then((ffn) => {
        const filtered = ffn.filter((item) => item != null);
        res.json({ news: filtered });
      })
      .catch((e) => {
        console.log(e);
        res.json({ news: [] });
      });
  }
  async getFriendsNewsPost(req, res) {
    const post = await UserPost.findById(req.params.id);
    if (post) {
      res.json({ post });
    } else {
      res.json({ post: null });
    }
  }
}

module.exports = new NewsService();
