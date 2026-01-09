const { Router } = require("express");

const router = Router();
const auth = require("../middleware/auth.middleware");
const MessengerGroupService = require("../services/MessengerGroupService");

router.post("/create-room", auth, (req, res) => {
  try {
    MessengerGroupService.createRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/change-title/:id", auth, (req, res) => {
  try {
    MessengerGroupService.changeTitle(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/change-avatar/:id", auth, (req, res) => {
  try {
    MessengerGroupService.changeAvatar(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/members/:id", (req, res) => {
  try {
    MessengerGroupService.members(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/full-members/:id", (req, res) => {
  try {
    MessengerGroupService.fullMembers(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/invite/:room/:user", auth, (req, res) => {
  try {
    MessengerGroupService.invite(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/exclude/:id/:user", auth, (req, res) => {
  try {
    MessengerGroupService.exclude(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/edit-group/:id", (req, res) => {
  try {
    MessengerGroupService.editGroup(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/leave/:id", auth, (req, res) => {
  try {
    MessengerGroupService.leave(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/room/:id", auth, (req, res) => {
  try {
    MessengerGroupService.getRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/room/:id", auth, (req, res) => {
  try {
    MessengerGroupService.remove(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/read/:id", auth, (req, res) => {
  try {
    MessengerGroupService.read(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/upload-bg/:id", (req, res) => {
  try {
    MessengerGroupService.uploadBg(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/connect/:id/:user", async (req, res) => {
  try {
    MessengerGroupService.connect(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/messages/:page/:offset", auth, (req, res) => {
  try {
    MessengerGroupService.messages(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/new-messages/:id", auth, async (req, res) => {
  try {
    MessengerGroupService.newMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.delete("/message/:id", auth, async (req, res) => {
  try {
    MessengerGroupService.deleteMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.patch("/message/:id", auth, async (req, res) => {
  try {
    MessengerGroupService.editMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
