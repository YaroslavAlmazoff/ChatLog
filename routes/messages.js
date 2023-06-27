const { Router } = require("express");

const router = Router();
const auth = require("../middleware/auth.middleware");
const Message = require("../models/Message");
const MessengerService = require("../services/MessengerService");

const uuid = require("uuid");

const events = require("events");
const User = require("../models/User");
const FileService = require("../services/FileService");
const ImageService = require("../services/ImageService");
const Room = require("../models/Room");
const ReactionsService = require("../services/ReactionsService");
const emitter = new events.EventEmitter();

events.EventEmitter.defaultMaxListeners = 2;
events.EventEmitter.setMaxListeners(2);

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
router.get("/getmessagesstart/:room", (req, res) => {
  try {
    MessengerService.getMessageStart(req, res);
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
router.get("/roombyid/:id", (req, res) => {
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

const removeDublicates = async (req) => {
  const message = await Message.findById(req.params.id);
  if (message) {
    const sameMessages = await Message.find({
      message: message.message,
      old: message.message,
      message: message.old,
      old: message.old,
      date: message.date,
      room: message.room,
    });
    for await (var i of sameMessages) {
      if (sameMessages.length == 1) {
        break;
      }
      if (i.imageUrl != "") {
        await ImageService.deleteFile(
          path.resolve("..", "static", "messagefotos", i.imageUrl)
        );
      } else if (i.videoUrl != "") {
        await ImageService.deleteFile(
          path.resolve("..", "static", "messagevideos", i.videoUrl)
        );
      } else if (i.audioUrl != "") {
        await ImageService.deleteFile(
          path.resolve("..", "static", "messageaudios", i.audioUrl)
        );
      }
      await Message.findByIdAndDelete(i._id);
    }
  }
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
  emitter.on("newMessage", async (message, req) => {
    Message.findOne({
      message: message.message,
      date: message.date,
      room: message.room,
    }).then(async (data) => {
      if (data) {
        console.log("уже существует");
        await removeDublicates(req);
        const messages = await Message.find({ room: message.room });
        const filtered = messages.filter(
          (v, i, a) =>
            a.findIndex((t) => t.message === v.message && t.date === v.date) ===
            i
        );
        getMessagesMobile(res, filtered);
      } else {
        console.log("не существует, создается");
        if (message.file) {
          console.log("с изображением");
          const filename = uuid.v4() + ".jpg";
          ImageService.saveImageBase64(message.file, filename, "messagefotos");
          Message.create({ ...message, imageUrl: filename }).then(async () => {
            await removeDublicates(req);
            const messages = await Message.find({ room: message.room });
            const filtered = messages.filter(
              (v, i, a) =>
                a.findIndex(
                  (t) => t.message === v.message && t.date === v.date
                ) === i
            );
            filtered.forEach((el) => console.log("[" + el._id + "]"));
            res.write(`data: ${JSON.stringify(filtered)} \n\n`);
          });
        } else if (req.files) {
          if (req.files.file) {
            console.log("с изображением от приложения");
            const filename1 = uuid.v4() + ".jpg";
            await FileService.insertMessageFoto(req.files.file, filename1);
            Message.create({ ...message, imageUrl: filename1 }).then(
              async () => {
                await removeDublicates(req);
                const messages = await Message.find({ room: message.room });
                const filtered = messages.filter(
                  (v, i, a) =>
                    a.findIndex(
                      (t) => t.message === v.message && t.date === v.date
                    ) === i
                );
                filtered.forEach((el) => console.log("[" + el._id + "]"));
                res.write(`data: ${JSON.stringify(filtered)} \n\n`);
              }
            );
          } else if (req.files.videoFile) {
            console.log("с видео от приложения");
            const filename1 = uuid.v4() + ".mp4";
            await FileService.insertMessageVideo(
              req.files.videoFile,
              filename1
            );
            Message.create({ ...message, videoUrl: filename1 }).then(
              async () => {
                await removeDublicates(req);
                const messages = await Message.find({ room: message.room });
                const filtered = messages.filter(
                  (v, i, a) =>
                    a.findIndex(
                      (t) => t.message === v.message && t.date === v.date
                    ) === i
                );
                filtered.forEach((el) => console.log("[" + el._id + "]"));
                res.write(`data: ${JSON.stringify(filtered)} \n\n`);
              }
            );
          } else if (req.files.audioFile) {
            console.log("с audio от приложения");
            const filename1 = uuid.v4() + ".mp3";
            await FileService.insertMessageAudio(
              req.files.audioFile,
              filename1
            );
            Message.create({ ...message, audioUrl: filename1 }).then(
              async () => {
                await removeDublicates(req);
                const messages = await Message.find({ room: message.room });
                const filtered = messages.filter(
                  (v, i, a) =>
                    a.findIndex(
                      (t) => t.message === v.message && t.date === v.date
                    ) === i
                );
                filtered.forEach((el) => console.log("[" + el._id + "]"));
                res.write(`data: ${JSON.stringify(filtered)} \n\n`);
              }
            );
          }
        } else if (message.videoFile) {
          console.log("с видео");
          const filename = uuid.v4() + ".mp4";
          ImageService.saveVideoBase64(
            message.videoFile,
            filename,
            "messagevideos"
          );
          Message.create({ ...message, videoUrl: filename }).then(async () => {
            await removeDublicates(req);
            const messages = await Message.find({ room: message.room });
            const filtered = messages.filter(
              (v, i, a) =>
                a.findIndex(
                  (t) => t.message === v.message && t.date === v.date
                ) === i
            );
            filtered.forEach((el) => console.log("[" + el._id + "]"));
            res.write(`data: ${JSON.stringify(filtered)} \n\n`);
          });
        } else if (message.audioFile) {
          console.log("с голосовым");
          const filename = uuid.v4() + ".mp3";
          ImageService.saveAudioBase64(
            message.audioFile,
            filename,
            "messageaudios"
          );
          Message.create({ ...message, audioUrl: filename }).then(async () => {
            await removeDublicates(req);
            const messages = await Message.find({ room: message.room });
            const filtered = messages.filter(
              (v, i, a) =>
                a.findIndex(
                  (t) => t.message === v.message && t.date === v.date
                ) === i
            );
            filtered.forEach((el) => console.log("[" + el._id + "]"));
            res.write(`data: ${JSON.stringify(filtered)} \n\n`);
          });
        } else {
          Message.create({ ...message, isNotReaded: true }).then(async () => {
            console.log("просто сообщение");
            await removeDublicates(req);
            const messages = await Message.find({ room: message.room });
            const filtered = messages.filter(
              (v, i, a) =>
                a.findIndex(
                  (t) => t.message === v.message && t.date === v.date
                ) === i
            );
            filtered.forEach((el) => console.log("[" + el._id + "]"));
            res.write(`data: ${JSON.stringify(filtered)} \n\n`);
          });
        }
      }
    });
  });
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
  emitter.on("newMessage", async (message, req) => {
    Message.findOne({
      message: message.message,
      date: message.date,
      room: message.room,
    }).then(async (data) => {
      if (data) {
        console.log("уже существует");
        await removeDublicates(req);
        res.write(`data: ${JSON.stringify(data)} \n\n`);
      } else {
        console.log("не существует, создается");
        if (req.files) {
          if (req.files.file) {
            console.log("с изображением от приложения");
            const filename1 = uuid.v4() + ".jpg";
            await FileService.insertMessageFoto(req.files.file, filename1);
            Message.create({ ...message, imageUrl: filename1 }).then(
              async (data) => {
                await removeDublicates(req);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          } else if (req.files.videoFile) {
            console.log("с видео от приложения");
            const filename1 = uuid.v4() + ".mp4";
            await FileService.insertMessageVideo(
              req.files.videoFile,
              filename1
            );
            Message.create({ ...message, videoUrl: filename1 }).then(
              async (data) => {
                await removeDublicates(req);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          } else if (req.files.audioFile) {
            console.log("с audio от приложения");
            const filename1 = uuid.v4() + ".mp3";
            await FileService.insertMessageAudio(
              req.files.audioFile,
              filename1
            );
            Message.create({ ...message, audioUrl: filename1 }).then(
              async (data) => {
                await removeDublicates(req);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          }
        } else {
          Message.create({ ...message, isNotReaded: true }).then(
            async (data) => {
              console.log("просто сообщение");
              await removeDublicates(req);
              res.write(`data: ${JSON.stringify(data)} \n\n`);
            }
          );
        }
      }
    });
  });
});

router.post("/new-messages/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  console.log("в роуте");
  const message = req.body;
  console.log(message);
  await Room.findByIdAndUpdate(req.params.id, { lastMessage: message.message });
  message.isFile =
    message.isFile == "true" || message.isFile == true ? true : false;
  message.room = req.params.id;
  message.avatarUrl = user.avatarUrl;
  message.name = user.name;
  message.isNotReaded = true;
  message.user = user._id;
  message.date = message.date;
  emitter.emit("newMessage", message, req);
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

module.exports = router;
