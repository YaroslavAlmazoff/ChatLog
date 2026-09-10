const { Router } = require("express");
const AstroController = require("./astroController");
const router = Router();
const auth = require("./auth/middleware/auth.middleware");

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
router.get("/new-token/:token/:id", (req, res) => {
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
router.get("/sponsors", (req, res) => {
  try {
    AstroController.getSponsors(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/new-sponsor", auth, (req, res) => {
  try {
    AstroController.newSponsor(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
