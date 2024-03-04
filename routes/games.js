const { Router } = require("express");
const GamesService = require("../services/GamesService");
const router = Router();
const auth = require("../middleware/auth.middleware");

router.get("/games", (req, res) => {
  try {
    GamesService.games(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/game/:id", (req, res) => {
  try {
    GamesService.game(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/upload", (req, res) => {
  try {
    GamesService.uploadGame(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/update/:id", (req, res) => {
  try {
    GamesService.updateGame(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/rate/:id/:rating", (req, res) => {
  try {
    GamesService.rate(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/comment/:id", auth, (req, res) => {
  try {
    GamesService.comment(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/comments/:id", (req, res) => {
  try {
    GamesService.comments(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/likecomment/:id", auth, (req, res) => {
  try {
    GamesService.likeComment(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
