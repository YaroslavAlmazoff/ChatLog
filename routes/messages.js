const { Router } = require("express");

const uuid = require("uuid");
const multer = require("multer");
const events = require("events");
const path = require("path");

const auth = require("../middleware/auth.middleware");

const User = require("../models/User");
const Room = require("../models/Room");
const ChatRoom = require("../models/ChatRoom");
const NotificationToken = require("../models/NotificationToken");
const Message = require("../models/Message");
const File = require("../models/File");

const MessengerService = require("../services/MessengerService");
const FileService = require("../services/FileService");
const ImageService = require("../services/ImageService");
const FirebaseService = require("../services/FirebaseService");

const router = Router();
const emitter = new events.EventEmitter();

events.EventEmitter.defaultMaxListeners = 4;
events.EventEmitter.setMaxListeners(4);

router.get("/createroom/:to", auth, (req, res) => {
  try {
    MessengerService.createRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/createroom-mobile/:id/:to", (req, res) => {
  try {
    MessengerService.createRoomMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getrooms", auth, (req, res) => {
  try {
    MessengerService.getRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getnewrooms", auth, (req, res) => {
  try {
    MessengerService.getNotReadedRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getrooms-mobile", auth, (req, res) => {
  try {
    MessengerService.getRoomsMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getroom/:user2", auth, (req, res) => {
  try {
    MessengerService.getRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getmessages/:room", (req, res) => {
  try {
    MessengerService.getMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/sendmessage/:room", auth, (req, res) => {
  try {
    MessengerService.sendMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/deletemessage/:id", (req, res) => {
  try {
    MessengerService.deleteMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/editmessage/:id", (req, res) => {
  try {
    MessengerService.editMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/room-by-id/:id", auth, (req, res) => {
  try {
    MessengerService.getRoomById(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/lastmessage/:room", (req, res) => {
  try {
    MessengerService.lastMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/newmessage/:id", (req, res) => {
  try {
    MessengerService.newMessageExists(req, res);
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
router.get("/checkrooms/:user", auth, (req, res) => {
  try {
    MessengerService.checkRooms(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getroomid/:user2", auth, (req, res) => {
  try {
    MessengerService.getRoomId(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getfulllastmessage/:id", (req, res) => {
  try {
    MessengerService.getFullLastMessage(req, res);
  } catch (e) {
    console.log(e);
  }
});

const filterMessages = async (room) => {
  const messages = await Message.find({ room });
  return messages
    .filter(
      (v, i, a) =>
        a.findIndex((t) => t.message === v.message && t.date === v.date) === i
    )
    .reverse();
};

const getMessagesPortion = (pageNumber) => {
  const page = parseInt(pageNumber) || 1;
  const perPage = 10;
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;
  return { startIndex, endIndex };
};

const sendMessages = async (res, room, page) => {
  const filtered = await filterMessages(room);
  const { startIndex, endIndex } = getMessagesPortion(page);
  const results = filtered.slice(startIndex, endIndex);
  res.write(
    `data: ${JSON.stringify({
      messages: results,
      count: filtered.length,
      isLast: endIndex >= filtered.length,
    })} \n\n`
  );
};

router.get("/connect/:id", async (req, res) => {
  console.log("connection");
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Accept-Ranges": "bytes",
    "Content-Range": "bytes 100-64656926/64656927",
  });

  sendMessages(res, req.params.id, 1);

  emitter.on("messages", async (page) => {
    await sendMessages(res, req.params.id, page);
  });
  emitter.on("newMessage", async (message) => {
    Message.findOne({
      message: message.message,
      date: message.date,
      room: message.room,
    }).then(async (data) => {
      if (!data) {
        const created = await Message.create(message);
        await Room.findByIdAndUpdate(message.room, {
          lastMessageId: created._id,
          lastMessage: created.message,
        });
        res.write(
          `data: ${JSON.stringify({
            messages: [created],
          })} \n\n`
        );
      }
    });
  });
});

router.get("/messages/:page", auth, (req, res) => {
  try {
    emitter.emit("messages", req.params.page);
  } catch (e) {
    console.log(e);
  }
});

router.get("/connect-mobile/:id", async (req, res) => {
  console.log("connection");
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Accept-Ranges": "bytes",
    "Content-Range": "bytes 100-64656926/64656927",
  });
  emitter.on("newMessageMobile", async (message, files) => {
    Message.findOne({
      message: message.message,
      date: message.date,
      room: message.room,
    }).then(async (data) => {
      if (data) {
        console.log("уже существует");
        //await removeDublicates(req);
        res.write(`data: ${JSON.stringify(data)} \n\n`);
      } else {
        console.log("не существует, создается", files);
        if (files) {
          if (files.file) {
            console.log("с изображением от приложения");
            const filename1 = uuid.v4() + ".jpg";
            await FileService.insertMessageFoto(files.file, filename1);
            Message.create({ ...message, imageUrl: filename1 }).then(
              async (data) => {
                //await removeDublicates(req);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          } else if (files.videoFile) {
            console.log("с видео от приложения");
            const filename1 = uuid.v4() + ".mp4";
            await FileService.insertMessageVideo(files.videoFile, filename1);
            Message.create({ ...message, videoUrl: filename1 }).then(
              async (data) => {
                //await removeDublicates(req);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          } else if (files.audioFile) {
            console.log("с audio от приложения");
            const filename1 = uuid.v4() + ".mp3";
            await FileService.insertMessageAudio(files.audioFile, filename1);
            Message.create({ ...message, audioUrl: filename1 }).then(
              async (data) => {
                //await removeDublicates(req);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          }
        } else {
          Message.create({ ...message, isNotReaded: true }).then(
            async (data) => {
              console.log("просто сообщение");
              //await removeDublicates(req);
              res.write(`data: ${JSON.stringify(data)} \n\n`);
            }
          );
        }
      }
    });
  });
});

const getDestination = (req, file, cb) => {
  if (file.fieldname === "image") {
    cb(null, "../static/messagefotos");
  } else if (file.fieldname === "video") {
    cb(null, "../static/messagevideos");
  } else if (file.fieldname === "audio") {
    cb(null, "../static/messageaudios");
  } else {
    cb(new Error("Неизвестный тип файла"), false);
  }
};

const filename = (req, file, cb) => {
  cb(null, uuid.v4() + path.extname(file.originalname));
};

const fileStorage = multer.diskStorage({
  destination: getDestination,
  filename,
});

const upload = multer({ storage: fileStorage });

router.post(
  "/new-messages/:id",
  auth,
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "video", maxCount: 2 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    const user = await User.findById(req.user.userId);
    const room = await Room.findById(req.params.id);

    const message = req.body;

    const imageNames = req.files["image"]
      ? req.files["image"].map((file) => file.filename)
      : [];
    const videoNames = req.files["video"]
      ? req.files["video"].map((file) => file.filename)
      : [];
    const audioNames = req.files["audio"]
      ? req.files["audio"].map((file) => file.filename)
      : [];

    message.isFile =
      message.isFile == "true" || message.isFile == true ? true : false;
    message.room = req.params.id;
    message.avatarUrl = user.avatarUrl;
    message.name = user.name;
    message.isNotReaded = true;
    message.user = user._id;
    message.imageNames = imageNames;
    message.videoNames = videoNames;
    message.audioNames = audioNames;

    let to = "";
    if (room.user1.toString() == req.user.userId) {
      to = room.user2;
    } else {
      to = room.user1;
    }

    const token = await NotificationToken.findOne({ user: to });

    if (token != null) {
      const name = user.name + " " + user.surname;
      FirebaseService.send(name, message.message, token.token, {
        id: room._id.toString(),
        type: "message",
        message: message.message,
        name,
        click_action: "MESSENGER",
      });
    }

    if (
      message.fileLink == null ||
      message.fileLink == "null" ||
      message.fileLink == ""
    ) {
      message.fileLink = "";
    } else {
      await File.findByIdAndUpdate(message.fileLink, { public: true });
    }
    emitter.emit("newMessage", message);
    res.status(200);
  }
);

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

router.post("/uploadbg/:id", (req, res) => {
  try {
    MessengerService.uploadBg(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/uploadbg-mobile/:id", (req, res) => {
  try {
    MessengerService.uploadBgMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/user2byroom/:user/:id", (req, res) => {
  try {
    MessengerService.user2byRoom(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/last-message-mobile/:id", (req, res) => {
  try {
    MessengerService.lastMessageMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});

const getMessagesMobile = async (res, messages) => {
  const fullMessages = messages.map(async (el) => {
    const message = el.toObject();
    if (!message.message) message.message = "";
    if (!message.to) message.to = "";
    return message;
  });
  Promise.all(fullMessages)
    .then((data) => {
      const filtered = data.filter(
        (v, i, a) =>
          a.findIndex((t) => t.message === v.message && t.date === v.date) === i
      );
      res.write(`data: ${JSON.stringify(filtered)} \n\n`);
    })
    .catch((e) => {
      console.log(e);
      res.write(`data: ${[]} \n\n`);
    });
};

router.get("/all-messages", auth, async (req, res) => {
  try {
    const user = req.user.userId; //id

    let rooms1 = await Room.find({ user1: user });
    let rooms2 = await Room.find({ user2: user });
    let rooms3 = await ChatRoom.find({ members: user });
    const rooms = rooms1.concat(rooms2, rooms3);

    const messages = rooms.map(async (item) => {
      const currentMessages = await Message.find({ room: item._id });
      console.log(currentMessages);
      return currentMessages.length > 10
        ? currentMessages.slice(
            currentMessages.length - 11,
            currentMessages.length - 1
          )
        : currentMessages;
    });

    Promise.all(messages)
      .then((data) => {
        const flatten = data.flat();
        const filtered = flatten.filter((el) => el != null && el != undefined);
        const short = filtered.map((el) => {
          return el.message.length > 100 ? null : el;
        });
        const filtered2 = short.filter((el) => el != null && el != undefined);
        const unique = filtered2.filter(
          (v, i, a) =>
            a.findIndex((t) => t.message === v.message && t.date === v.date) ===
            i
        );
        for (let i = 0; i < unique.length; i++) {
          console.log(unique[i].message);
        }
        res.json({ messages: unique });
        res.end();
        return;
      })
      .catch((e) => {
        console.log(e);
        res.json({ messages: [] });
        res.end();
        return;
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/new-messages-mobile/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  const message = req.body;
  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
    lastMessage: message.message,
  });
  message.isFile =
    message.isFile == "true" || message.isFile == true ? true : false;
  message.room = req.params.id;
  message.avatarUrl = user.avatarUrl;
  message.name = user.name;
  message.isNotReaded = true;
  message.user = user._id;
  message.message = message.message;

  let tokenString = "";
  let to = "";
  if (updatedRoom.user1.toString() == req.user.userId) {
    to = updatedRoom.user2;
  } else {
    to = updatedRoom.user1;
  }

  const token = await NotificationToken.findOne({ user: to });

  if (token != null) {
    tokenString = token.token;
    FirebaseService.send(
      user.name + " " + user.surname,
      message.message,
      tokenString,
      {
        id: updatedRoom._id.toString(),
        type: "message",
        message: message.message,
        name: user.name + " " + user.surname,
        click_action: "MESSENGER",
      }
    );
  }

  if (
    message.fileLink == null ||
    message.fileLink == "null" ||
    message.fileLink == ""
  ) {
    message.fileLink = "";
  } else {
    await File.findByIdAndUpdate(message.fileLink, { public: true });
  }
  emitter.emit("newMessageMobile", message, req.files, req.params.id);
  res.status(200);
});

module.exports = router;
