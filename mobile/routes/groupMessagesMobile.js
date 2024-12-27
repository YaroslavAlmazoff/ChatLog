const { Router } = require("express");

const router = Router();
const auth = require("../../middleware/auth.middleware");
const MessengerGroupServiceMobile = require("../services/MessengerGroupServiceMobile");

router.get("/getchatrooms-mobile", auth, (req, res) => {
  try {
    MessengerGroupServiceMobile.getRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/invite-mobile/:id/:user", (req, res) => {
  try {
    MessengerGroupServiceMobile.invite(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/new-chatmessages-mobile/:id", auth, async (req, res) => {
  try {
    MessengerGroupServiceMobile.newChatMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/edit-discussion/:id", auth, async (req, res) => {
  try {
    MessengerGroupServiceMobile.editGroup(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
