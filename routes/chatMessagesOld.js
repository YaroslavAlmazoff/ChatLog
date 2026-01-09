const { Router } = require("express");

const router = Router();
const auth = require("../middleware/auth.middleware");
const ChatRoomService = require("../services/ChatRoomService");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const ImageService = require("../services/ImageService");

const events = require("events");
const emitter = new events.EventEmitter();

const uuid = require("uuid");

router.post("/createchatroom", auth, (req, res) => {
  try {
    ChatRoomService.createRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getchatrooms", auth, (req, res) => {
  try {
    ChatRoomService.getRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getchatrooms-mobile", auth, (req, res) => {
  try {
    ChatRoomService.getRoomsMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/members/:id", (req, res) => {
  try {
    ChatRoomService.members(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/fullmembers/:id", (req, res) => {
  try {
    ChatRoomService.fullMembers(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/invite/:id", (req, res) => {
  try {
    ChatRoomService.invite(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/invite-mobile/:id/:user", (req, res) => {
  try {
    ChatRoomService.inviteMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/exclude/:id/:user", auth, (req, res) => {
  try {
    ChatRoomService.exclude(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/edit-discussion/:id", (req, res) => {
  try {
    ChatRoomService.editDiscussion(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getchatmessages/:room", (req, res) => {
  try {
    ChatRoomService.getMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getchatmessagesstart/:room", (req, res) => {
  try {
    ChatRoomService.getMessageStart(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/sendchatmessage/:room", auth, (req, res) => {
  try {
    ChatRoomService.sendMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/deletechatmessage/:id", (req, res) => {
  try {
    ChatRoomService.deleteMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/editchatmessage/:id", (req, res) => {
  try {
    ChatRoomService.editMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/chatroombyid/:id", (req, res) => {
  try {
    ChatRoomService.getRoomById(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/lastchatmessage/:room", (req, res) => {
  try {
    ChatRoomService.lastMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/leave/:id", auth, (req, res) => {
  try {
    ChatRoomService.leave(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/remove/:id", auth, (req, res) => {
  try {
    ChatRoomService.remove(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/newchatmessage/:id", (req, res) => {
  try {
    ChatRoomService.newMessageExists(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/chatread/:id", auth, (req, res) => {
  try {
    ChatRoomService.read(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getfullchatlastmessage/:id", (req, res) => {
  try {
    ChatRoomService.getFullLastMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/chatconnect/:id", async (req, res) => {
  console.log("connection");
  //const messages = await Message.find({room: req.params.id})
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Accept-Ranges": "bytes",
    "Content-Range": "bytes 100-64656926/64656927",
  });
  emitter.on("newChatMessage", async (message) => {
    Message.findOne({
      message: message.message,
      date: message.date,
      room: message.room,
    }).then(async (data) => {
      if (data) {
        const messages = await Message.find({ room: message.room });
        res.write(`data: ${JSON.stringify(messages)} \n\n`);
        return;
      }
      console.log("в эмиттере");
      if (message.file) {
        const filename = uuid.v4() + ".jpg";
        ImageService.saveImageBase64(message.file, filename, "messagefotos");
        Message.create({ ...message, imageUrl: filename }).then(async () => {
          removeDups();
          console.log("сообщение создано");
          const messages = await Message.find({ room: message.room });
          res.write(`data: ${JSON.stringify(messages)} \n\n`);
        });
      } else if (message.videoFile) {
        const filename = uuid.v4() + ".mp4";
        ImageService.saveVideoBase64(
          message.videoFile,
          filename,
          "messagevideos"
        );
        Message.create({ ...message, videoUrl: filename }).then(async () => {
          removeDups();
          console.log("сообщение создано");
          const messages = await Message.find({ room: message.room });
          res.write(`data: ${JSON.stringify(messages)} \n\n`);
        });
      } else if (message.audioFile) {
        const filename = uuid.v4() + ".mp3";
        ImageService.saveAudioBase64(
          message.audioFile,
          filename,
          "messageaudios"
        );
        Message.create({ ...message, audioUrl: filename }).then(async () => {
          removeDups();
          console.log("сообщение создано");
          const messages = await Message.find({ room: message.room });
          res.write(`data: ${JSON.stringify(messages)} \n\n`);
        });
      } else {
        Message.create({ ...message }).then(async () => {
          removeDups();
          console.log("сообщение создано");
          const messages = await Message.find({ room: message.room });
          res.write(`data: ${JSON.stringify(messages)} \n\n`);
        });
      }
    });
  });
});

router.post("/new-chatmessages/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  console.log("в роуте");
  const message = req.body;
  await ChatRoom.findByIdAndUpdate(req.params.id, {
    lastMessage: message.message,
  });
  message.room = req.params.id;
  message.avatarUrl = user.avatarUrl;
  message.name = user.name;
  message.user = user._id;
  emitter.emit("newChatMessage", message);
  res.status(200);
});
router.post("/new-chatmessages-mobile/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  console.log("в роуте");
  const message = req.body;
  console.log(message);
  await ChatRoom.findByIdAndUpdate(req.params.id, {
    lastMessage: message.message,
  });
  message.isFile =
    message.isFile == "true" || message.isFile == true ? true : false;
  message.room = req.params.id;
  message.avatarUrl = user.avatarUrl;
  message.name = user.name;
  message.isNotReaded = true;
  message.user = user._id;
  message.date = message.date;
  emitter.emit("newChatMessage", message, req);
  res.status(200);
});

router.post("/uploadbg/:id", (req, res) => {
  try {
    ChatRoomService.uploadBg(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/new-chat-messages/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.userId); //id
  const message = req.body;
  const updatedRoom = await ChatRoom.findByIdAndUpdate(req.params.id, {
    lastMessage: message.message,
  });
  message.isFile =
    message.isFile == "true" || message.isFile == true ? true : false;
  message.room = req.params.id;
  message.avatarUrl = user.avatarUrl;
  message.name = user.name;
  message.isNotReaded = true;
  message.user = user._id;
  message.date = message.date;

  const tokens = [];

  const tkns = updatedRoom.members.map(async (user) => {
    const token = await NotificationToken.findOne({ user });
    if (token) tokens.push(token.token);
  });

  Promise.all(tkns).then((data) => {
    console.log(tokens);
    FirebaseService.sendMulticast(
      user.name + " " + user.surname,
      message.message,
      tokens.filter((value) => value != req.user.userId),
      {
        id: updatedRoom._id.toString(),
        type: "chatmessage",
        message: message.message,
        name: updatedRoom.title,
        click_action: "CHAT",
      }
    );
  });

  if (message.fileLink == null || message.fileLink == "null") {
    message.fileLink = "";
  } else {
    await File.findByIdAndUpdate(message.fileLink, { public: true });
  }
  emitter.emit("newMessageMobile", message, req);
  res.status(200);
});

module.exports = router;
