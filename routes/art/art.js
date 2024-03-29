const { Router } = require("express");
const ArtService = require("../../services/ArtShop/ArtService");
const router = Router();

router.post("/send-data", (req, res) => {
  try {
    ArtService.sendData(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
