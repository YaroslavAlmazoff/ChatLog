const Room = require("../../models/Room");
const Message = require("../../models/Message");
const User = require("../../models/User");
const FileService = require("../../services/FileService");
const FirebaseService = require("../../services/FirebaseService");

class MessengerServiceMobile {
  async createRoom(req, res) {
    const user1 = req.params.id;
    const user2 = req.params.to;

    const room1 = await Room.findOne({ user1, user2 });
    const room2 = await Room.findOne({ user1: user2, user2: user1 });

    if (room1) {
      res.json({ err: 1, room: room1 });
    } else if (room2) {
      res.json({ err: 1, room: room2 });
    } else {
      Room.create({ user1, user2 })
        .then((data) => {
          res.json({ err: 0, room: data });
        })
        .catch((err) => res.json({ err: 2, room: "", errors: [err.message] }));
    }
  }
  async lastMessage(req, res) {
    const id = req.params.id;
    const messages = await Message.find({ room: id });
    if (!messages.length) {
      res.json({ msg: "err" });
      return;
    }
    const lastMessage = messages[messages.length - 1];
    const lastMessageObj = lastMessage.toObject();
    if (!lastMessage.message) lastMessage.message = "";
    if (!lastMessage.to) lastMessage.to = "";
    res.json(lastMessageObj);
  }

  async uploadBg(req, res) {
    const filename = uuid.v4() + ".jpg";
    await Room.findByIdAndUpdate(req.params.id, { bg: filename });
    FileService.insertRoomBackground(req.files.file, filename);
    res.json("");
  }

  async newMessageMobile(req, res) {
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
  }

  async connectMobile(req, res) {
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
                  res.write(`data: ${JSON.stringify(data)} \n\n`);
                }
              );
            } else if (files.videoFile) {
              console.log("с видео от приложения");
              const filename1 = uuid.v4() + ".mp4";
              await FileService.insertMessageVideo(files.videoFile, filename1);
              Message.create({ ...message, videoUrl: filename1 }).then(
                async (data) => {
                  res.write(`data: ${JSON.stringify(data)} \n\n`);
                }
              );
            } else if (files.audioFile) {
              console.log("с audio от приложения");
              const filename1 = uuid.v4() + ".mp3";
              await FileService.insertMessageAudio(files.audioFile, filename1);
              Message.create({ ...message, audioUrl: filename1 }).then(
                async (data) => {
                  res.write(`data: ${JSON.stringify(data)} \n\n`);
                }
              );
            }
          } else {
            Message.create({ ...message, isNotReaded: true }).then(
              async (data) => {
                console.log("просто сообщение");
                res.write(`data: ${JSON.stringify(data)} \n\n`);
              }
            );
          }
        }
      });
    });
  }

  async getRooms(req, res) {
    const user = req.user.userId;

    let rooms1 = await Room.find({ user1: user });
    let rooms2 = await Room.find({ user2: user });
    const rooms = rooms1.concat(rooms2);

    const fullRooms = rooms.map(async (el) => {
      const room = el;
      if (room == null) return null;
      const user1 = await User.findById(room.user1);
      const user2 = await User.findById(room.user2);

      if (!user1 || !user2) {
        return null;
      }

      const messages = await Message.find({ room: room._id });
      if (!messages.length) {
        return null;
      }
      const roomObj = room.toObject();
      roomObj.read =
        !messages[messages.length - 1].isNotReaded ||
        user.toString() == messages[messages.length - 1].user.toString();

      if (user == room.user1) {
        roomObj.name = user2.name + " " + user2.surname;
        roomObj.avatar = user2.avatarUrl;
        return roomObj;
      } else {
        roomObj.name = user1.name + " " + user1.surname;
        roomObj.avatar = user1.avatarUrl;
        return roomObj;
      }
    });
    Promise.all(fullRooms)
      .then((r) => {
        const filtered = r.filter((item) => item != null);
        res
          .set({
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Charset": "utf-8",
          })
          .json({ rooms: filtered });
      })
      .catch((e) => {
        console.log(e);
        res.json({ rooms: [], e: e.message });
      });
  }
}

module.exports = new MessengerServiceMobile();
