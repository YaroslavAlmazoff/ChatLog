const Room = require("../models/Room");
const ChatRoom = require("../models/ChatRoom");
const events = require("events");
const path = require("path");
const Message = require("../models/Message");
const User = require("../models/User");
const uuid = require("uuid");
const mongoose = require("mongoose");
const NotificationToken = require("../models/NotificationToken");
const File = require("../models/File");
const FileService = require("../services/FileService");
const FirebaseService = require("../services/FirebaseService");
const Utils = require("../utils/Utils");

const emitter = new events.EventEmitter();

// events.EventEmitter.defaultMaxListeners = 4;
// events.EventEmitter.setMaxListeners(4);

class MessengerService {
  async createRoom(req, res) {
    const user1 = req.user.userId;
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
          res.json({ err: 0, room: data._id });
        })
        .catch((err) => res.json({ err: 2, room: "", errors: [err.message] }));
      res.json({ msg: "success" });
    }
  }
  async getRooms(req, res) {
    const user = req.user.userId;

    let rooms1 = await Room.find({ user1: user });
    let rooms2 = await Room.find({ user2: user });

    let rooms = rooms1.concat(rooms2);
    let chatRooms = await ChatRoom.find({ members: user });

    rooms = rooms.map((room) => {
      const roomObj = room.toObject();
      roomObj.isChat = false;
      return roomObj;
    });

    chatRooms = chatRooms.map((room) => {
      const roomObj = room.toObject();
      roomObj.isChat = true;
      return roomObj;
    });

    const fullRooms = rooms.concat(chatRooms);

    const lastMessages = fullRooms.map(async (el, i) => {
      if (el.lastMessageId) {
        const message = await Message.findById(el.lastMessageId);
        if (message) {
          return message;
        } else {
          const allMessages = await Message.find({ room: el._id });
          if (allMessages.length > 0) {
            const lastMessage = allMessages[allMessages.length - 1];
            let lastMessageText = "";
            if (lastMessage.message) {
              lastMessageText = lastMessage.message;
            } else if (lastMessage.images.length) {
              lastMessageText = `Фото${
                lastMessage.images.length > 1
                  ? " (" + lastMessage.images.length + ")"
                  : ""
              }`;
            } else if (lastMessage.videos.length) {
              lastMessageText = `Видео${
                lastMessage.videos.length > 1
                  ? " (" + lastMessage.videos.length + ")"
                  : ""
              }`;
            }
            fullRooms[i].lastMessage = lastMessageText;
            fullRooms[i].lastMessageId = lastMessage._id;
            return lastMessage;
          } else return { _id: null };
        }
      } else {
        const messages = await Message.find({ room: el._id });
        return messages[messages.length - 1];
      }
    });

    Promise.all(lastMessages)
      .then((data) => {
        const filteredMessages = data.filter((message) => message != null);
        const sortedMessages = filteredMessages.sort((a, b) => {
          if (
            a.date.split(" ")[0].split(".")[2] ===
              b.date.split(" ")[0].split(".")[2] &&
            a.date.split(" ")[0].split(".")[1] ===
              b.date.split(" ")[0].split(".")[1] &&
            a.date.split(" ")[0].split(".")[0] ===
              b.date.split(" ")[0].split(".")[0] &&
            a.date.split(" ")[1].split(":")[0] ===
              b.date.split(" ")[1].split(":")[0]
          ) {
            return (
              b.date.split(" ")[1].split(":")[1] -
              a.date.split(" ")[1].split(":")[1]
            );
          } else if (
            a.date.split(" ")[0].split(".")[2] ===
              b.date.split(" ")[0].split(".")[2] &&
            a.date.split(" ")[0].split(".")[1] ===
              b.date.split(" ")[0].split(".")[1] &&
            a.date.split(" ")[0].split(".")[0] ===
              b.date.split(" ")[0].split(".")[0]
          ) {
            return (
              b.date.split(" ")[1].split(":")[0] -
              a.date.split(" ")[1].split(":")[0]
            );
          } else if (
            a.date.split(" ")[0].split(".")[2] ===
              b.date.split(" ")[0].split(".")[2] &&
            a.date.split(" ")[0].split(".")[1] ===
              b.date.split(" ")[0].split(".")[1]
          ) {
            return (
              b.date.split(" ")[0].split(".")[1] -
              a.date.split(" ")[0].split(".")[1]
            );
          } else {
            return (
              b.date.split(" ")[0].split(".")[2] -
              a.date.split(" ")[0].split(".")[2]
            );
          }
        });
        const rooms = sortedMessages.map(async (el) => {
          const roomObj = fullRooms.find(
            (item) => item._id.toString() == el.room.toString()
          );
          if (roomObj.isChat) {
            roomObj.unread = !el.readedThisMessage.includes(
              mongoose.Types.ObjectId(user)
            );
          } else {
            roomObj.unread = el.isNotReaded;
            roomObj.sender = el.user;
            if (!el._id) roomObj.lastMessage = "Пустой чат";
            if (roomObj.user1 == user) {
              const fullUser = await User.findById(roomObj.user2);
              roomObj.name = fullUser.name;
              roomObj.surname = fullUser.surname;
              roomObj.avatarUrl = fullUser.avatarUrl;
            } else if (roomObj.user2 == user) {
              const fullUser = await User.findById(roomObj.user1);
              roomObj.name = fullUser.name;
              roomObj.surname = fullUser.surname;
              roomObj.avatarUrl = fullUser.avatarUrl;
            }
          }
          return roomObj;
        });
        Promise.all(rooms)
          .then((sortedRooms) => {
            const filteredRooms = sortedRooms.filter((el) => el != null);
            res.json({ rooms: filteredRooms });
          })
          .catch((e) => res.json({ e: e.message, rooms: [] }));
      })
      .catch((e) => res.json({ e: e.message, rooms: [] }));
  }
  async getRoomByUsers(req, res) {
    const user1 = req.user.userId;
    const user2 = req.params.user2;

    let room = await Room.findOne({ user1, user2 });
    if (!room) {
      room = await Room.findOne({ user1: user2, user2: user1 });
    }
    res.json({ room });
  }
  async getRoom(req, res) {
    const id = req.params.id;
    const room = await Room.findById(id);
    const roomObj = room.toObject();
    if (req.user.userId == room.user1.toString()) {
      const user = await User.findById(room.user2);
      roomObj.name = user.name + " " + user.surname;
      roomObj.date = user.lastVisit;
    } else {
      const user = await User.findById(room.user1);
      roomObj.name = user.name + " " + user.surname;
      roomObj.date = user.lastVisit;
    }
    if (!roomObj.bg) {
      roomObj.bg = "";
    }
    res.json({ room: roomObj });
  }
  async getRoomId(req, res) {
    const user1 = req.user.userId;
    const user2 = req.params.user2;

    let room = await Room.findOne({ user1, user2 });
    if (!room) {
      room = await Room.findOne({ user1: user2, user2: user1 });
    }
    res.json({ room: room._id });
  }

  async read(req, res) {
    const id = req.params.id;
    const messages = await Message.find({ room: id });
    if (!messages[messages.length - 1]) {
      res.json({ msg: "err" });
      return;
    }
    const lastMessage = messages[messages.length - 1];
    await Message.findByIdAndUpdate(lastMessage._id, { isNotReaded: false });
    res.json({ msg: "success" });
  }
  async checkRooms(req, res) {
    const user1 = req.user.userId;
    const user2 = req.params.user;

    const room1 = await Room.findOne({ user1, user2 });
    const room2 = await Room.findOne({ user1: user2, user2: user1 });

    if (room1) {
      res.json({ room: room1._id, exists: true });
    } else if (room2) {
      res.json({ room: room2._id, exists: true });
    } else {
      res.json({ room: null, exists: false });
    }
  }
  async uploadBg(req, res) {
    const filename = uuid.v4() + ".jpg";
    await Room.findByIdAndUpdate(req.params.id, { bg: filename });
    FileService.insertRoomBackground(req.files.file, filename);
    res.json({ filename });
  }
  async user2byRoom(req, res) {
    const room = await Room.findById(req.params.id);
    if (room.user1.toString() == req.params.user) {
      const user = await User.findById(room.user2);
      res.json({ user });
      res.end();
      return;
    } else if (room.user2.toString() == req.params.user) {
      const user = await User.findById(room.user1);
      res.json({ user });
      res.end();
      return;
    } else {
      res.json({
        user: { name: "", surname: "", lastVisit: "" },
      });
      res.end();
      return;
    }
  }

  async connect(req, res) {
    console.log("connection");
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
      "Content-Range": "bytes 100-64656926/64656927",
    });

    Utils.sendMessages(res, req.params.user, req.params.id, 1, 0, "init");

    const messages = async (page, offset, user) => {
      await Utils.sendMessages(res, user, req.params.id, page, offset, "load");
    };

    const newMessage = async (message) => {
      const existingMessage = await Message.findOne({
        images: { $eq: message.images },
        videos: { $eq: message.videos },
        message: message.message,
        date: message.date,
      });
      if (!existingMessage) {
        const created = new Message(message);
        const saveMessage = async () => {
          await created.save();
        };
        emitter.once("save-message", saveMessage);
        emitter.emit("save-message");
        emitter.off("save-message", saveMessage);
        await Room.findByIdAndUpdate(message.room, {
          lastMessageId: created._id,
          lastMessage: created.message,
        });
        res.write(
          `data: ${JSON.stringify({
            messages: [created],
            user: created.user,
            type: "create",
          })} \n\n`
        );
      }
    };

    const deleteMessage = async (deleted) => {
      res.write(
        `data: ${JSON.stringify({
          messages: [deleted],
          user: deleted.user,
          type: "delete",
        })} \n\n`
      );
    };

    const editMessage = async (edited, oldText, oldImages, oldVideos) => {
      res.write(
        `data: ${JSON.stringify({
          messages: [edited],
          user: edited.user,
          type: "edit",
          oldText,
          firstOldImage: oldImages[0],
          firstOldVideo: oldVideos[0],
        })} \n\n`
      );
    };

    emitter.on("messages", messages);
    emitter.on("newMessage", newMessage);
    emitter.on("deleteMessage", deleteMessage);
    emitter.on("editMessage", editMessage);

    req.on("close", () => {
      emitter.off("messages", messages);
      emitter.off("newMessage", newMessage);
      emitter.off("deleteMessage", deleteMessage);
      emitter.off("editMessage", editMessage);
    });
  }

  async messages(req, res) {
    try {
      emitter.emit(
        "messages",
        req.params.page,
        req.params.offset,
        req.user.userId
      );
      res.json({ message: "да ну тебя" });
    } catch (e) {
      console.log(e);
    }
  }

  async newMessage(req, res) {
    req.setTimeout(60 * 1000);
    const user = await User.findById(req.user.userId);
    const room = await Room.findById(req.params.id);

    const message = req.body;

    const imageExists = JSON.parse(req.body.imageExists);
    const videoExists = JSON.parse(req.body.videoExists);
    const audioExists = JSON.parse(req.body.audioExists);

    const images = imageExists
      ? Utils.processFiles(req.files, Utils.fileTypes.image)
      : [];
    const videos = videoExists
      ? Utils.processFiles(req.files, Utils.fileTypes.video)
      : [];

    const audios = audioExists ? Utils.processAudio(req.files) : "";

    message.isFile =
      message.isFile == "true" || message.isFile == true ? true : false;
    message.room = req.params.id;
    message.avatarUrl = user.avatarUrl;
    message.name = user.name;
    message.isNotReaded = true;
    message.user = user._id;
    message.images = images;
    message.videos = videos;
    message.audios = audios;
    message.hms = Utils.getCurrentTime();

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
    res.json({ message, user, room });
  }

  async deleteMessage(req, res) {
    const id = req.params.id;
    const message = await Message.findById(id);
    const messageCopy = message.toObject();
    if (message.user.toString() === req.user.userId) {
      Utils.dm(
        req,
        res,
        message.message,
        message.date,
        message.images,
        message.videos,
        messageCopy,
        emitter
      );
    } else {
      res.json({ id });
    }
  }

  async editMessage(req, res) {
    const id = req.params.id;
    const imageExists = JSON.parse(req.body.imageExists);
    const videoExists = JSON.parse(req.body.videoExists);
    const images = imageExists
      ? Utils.processFiles(req.files, Utils.fileTypes.image)
      : [];
    const videos = videoExists
      ? Utils.processFiles(req.files, Utils.fileTypes.video)
      : [];

    const message = await Message.findById(id);
    if (message.user.toString() === req.user.userId) {
      Utils.edit(
        req,
        res,
        message.message,
        message.date,
        req.body.message,
        message.images,
        message.videos,
        images,
        videos,
        emitter
      );
    } else {
      res.json({ id });
    }
  }
}

module.exports = new MessengerService();
