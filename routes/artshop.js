const { Router } = require("express");
const PicturesService = require("../services/ArtShop/PicturesService");
const router = Router();

router.get("/pictures", (req, res) => {
  try {
    PicturesService.pictures(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/picture/:id", (req, res) => {
  try {
    PicturesService.picture(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/create", (req, res) => {
  try {
    PicturesService.create(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
