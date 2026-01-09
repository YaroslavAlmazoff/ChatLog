const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const MessengerService = require("../services/MessengerService");
const router = Router();

router.get("/create-room/:to", auth, (req, res) => {
  try {
    MessengerService.createRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/get-rooms", auth, (req, res) => {
  try {
    MessengerService.getRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/room-by-users/:user2", auth, (req, res) => {
  try {
    MessengerService.getRoomByUsers(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/room/:id", auth, (req, res) => {
  try {
    MessengerService.getRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/read/:id", (req, res) => {
  try {
    MessengerService.read(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/check-rooms/:user", auth, (req, res) => {
  try {
    MessengerService.checkRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/get-room-id/:user2", auth, (req, res) => {
  try {
    MessengerService.getRoomId(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/connect/:id/:user", async (req, res) => {
  try {
    MessengerService.connect(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/messages/:page/:offset", auth, (req, res) => {
  try {
    MessengerService.messages(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/new-messages/:id", auth, async (req, res) => {
  try {
    MessengerService.newMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.delete("/message/:id", auth, async (req, res) => {
  try {
    MessengerService.deleteMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.patch("/message/:id", auth, async (req, res) => {
  try {
    MessengerService.editMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/upload-bg/:id", (req, res) => {
  try {
    MessengerService.uploadBg(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
