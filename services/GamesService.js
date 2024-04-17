const uuid = require("uuid");
const Game = require("../models/Game");
const GameComment = require("../models/GameComment");
const FileService = require("./FileService");
const User = require("../models/User");
const ImageService = require("./ImageService");
const path = require("path");
const Like = require("../models/Like");

class GamesService {
  async games(req, res) {
    const games = await Game.find({});
    const result = games.map((value) => {
      const game = value.toObject();
      if (!game.rating || game.rating == Infinity) game.rating = 0;
      if (!game.summRating || game.summRating == Infinity) game.summRating = 0;
      if (!game.marks) game.marks = 0;
      return game;
    });
    res.json({ games: result });
  }
  async uploadGame(req, res) {
    const { name, description, version } = req.body;
    const previewUrl = uuid.v4() + ".jpg";
    const downloadUrl = uuid.v4() + ".apk";

    await Game.create({ name, description, version, previewUrl, downloadUrl });
    FileService.insertGameSourсe(req.files.source, downloadUrl);
    FileService.insertGamePreview(req.files.preview, previewUrl);

    res.json({ msg: "success" });
  }
  async updateGame(req, res) {
    const { name, description, version } = req.body;
    const previewUrl = uuid.v4() + ".jpg";
    const downloadUrl = uuid.v4() + ".apk";
    const game = await Game.findById(req.params.id);

    await ImageService.deleteFile(
      path.resolve("..", "static", "gamedownloads", game.downloadUrl)
    );
    await ImageService.deleteFile(
      path.resolve("..", "static", "gamedownloads", game.downloadUrl)
    );

    if (req.files.preview) {
      await Game.findByIdAndUpdate(req.params.id, {
        name,
        description,
        version,
        previewUrl,
        downloadUrl,
      });
      FileService.insertGameSourсe(req.files.source, downloadUrl);
      FileService.insertGamePreview(req.files.preview, previewUrl);
    } else {
      await Game.findByIdAndUpdate(req.params.id, {
        name,
        description,
        version,
        downloadUrl,
      });
      FileService.insertGameSourсe(req.files.source, downloadUrl);
    }

    res.json({ msg: "success" });
  }
  async game(req, res) {
    const game = await Game.findById(req.params.id);
    const comments = await GameComment.find({ game: game._id });
    const gameObject = game.toObject();
    gameObject.comments = comments;
    res.json({ game: gameObject });
  }
  async rate(req, res) {
    const game = await Game.findById(req.params.id);
    const summRating = game.summRating + req.params.rating;
    let marks = game.marks;
    if (!marks) marks++;
    const itog = Math.ceil(summRating / marks) + 1;
    await Game.findByIdAndUpdate(req.params.id, {
      rating: itog,
      summRating,
      marks: marks + 1,
    });
    res.json({ msg: "success" });
  }
  async comment(req, res) {
    const { comment, date } = req.body;
    const fullUser = await User.findById(req.user.userId);
    GameComment.create({
      comment,
      date,
      user: req.user.userId,
      game: req.params.id,
      avatarUrl: fullUser.avatarUrl,
      userName: fullUser.name + " " + fullUser.surname,
    })
      .then(async () => {
        const comments = await GameComment.find({ game: req.params.id });
        res.json({ comments });
      })
      .catch(() => {
        res.json({ msg: "error" });
      });
  }
  async comments(req, res) {
    const comments = await GameComment.find({ game: req.params.id });
    res.json({ comments });
  }
  async likeComment(req, res) {
    const comment = await GameComment.findById(req.params.id);
    const like = await Like.findOne({
      user: req.user.userId,
      post: comment._id,
    });
    if (like) {
      const likes = comment.likes - 1;
      await GameComment.findByIdAndUpdate(req.params.id, { likes });
      await Like.findOneAndDelete({
        user: req.user.userId,
        post: req.params.id,
      });
      res.json({ liked: false });
    } else {
      const likes = comment.likes + 1;
      await GameComment.findByIdAndUpdate(req.params.id, { likes });
      await Like.create({ user: req.user.userId, post: req.params.id });
      res.json({ liked: true });
    }
  }
}

module.exports = new GamesService();
