const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");
const MessengerServiceMobile = require("../services/MessengerServiceMobile");

router.post("/new-messages-mobile/:id", auth, async (req, res) => {
  try {
    MessengerServiceMobile.newMessageMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/connect-mobile/:id", async (req, res) => {
  try {
    MessengerServiceMobile.connectMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/uploadbg-mobile/:id", (req, res) => {
  try {
    MessengerServiceMobile.uploadBg(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/last-message-mobile/:id", (req, res) => {
  try {
    MessengerServiceMobile.lastMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/getrooms-mobile", auth, (req, res) => {
  try {
    MessengerServiceMobile.getRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/createroom-mobile/:id/:to", (req, res) => {
  try {
    MessengerServiceMobile.createRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
