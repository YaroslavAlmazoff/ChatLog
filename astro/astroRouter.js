const { Router } = require("express");
const AstroController = require("./astroController");
const router = Router();

router.get("/events", (req, res) => {
  try {
    AstroController.events(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/new-event", (req, res) => {
  try {
    AstroController.newEvent(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/new-token/:token", (req, res) => {
  try {
    AstroController.newToken(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/new-image/:event", (req, res) => {
  try {
    AstroController.uploadImage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/images/:event", (req, res) => {
  try {
    AstroController.imagesList(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
