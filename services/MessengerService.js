const Room = require("../models/Room");
const ChatRoom = require("../models/ChatRoom");
const events = require("events");
const path = require("path");
const emitter = new events.EventEmitter();
const Message = require("../models/Message");
const User = require("../models/User");
const FileService = require("./FileService");
const uuid = require("uuid");
const RoomsArray = require("../models/RoomsArray");
const ImageService = require("./ImageService");
const mongoose = require("mongoose");

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
  async createRoomMobile(req, res) {
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

    const lastMessages = fullRooms.map(async (el) => {
      if (el.lastMessageId) {
        const message = await Message.findOne({ _id: el.lastMessageId });
        return message;
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
            console.log(
              b.date.split(" ")[1].split(":")[1],
              a.date.split(" ")[1].split(":")[1],
              b.date.split(" ")[1].split(":")[1] -
                a.date.split(" ")[1].split(":")[1]
            );
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
            console.log(
              b.date.split(" ")[1].split(":")[0],
              a.date.split(" ")[1].split(":")[0],
              b.date.split(" ")[1].split(":")[0] -
                a.date.split(" ")[1].split(":")[0]
            );
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
            console.log(
              b.date.split(" ")[0].split(".")[1],
              a.date.split(" ")[0].split(".")[1],
              b.date.split(" ")[0].split(".")[1] -
                a.date.split(" ")[0].split(".")[1]
            );
            return (
              b.date.split(" ")[0].split(".")[1] -
              a.date.split(" ")[0].split(".")[1]
            );
          } else {
            console.log(
              b.date.split(" ")[0].split(".")[2],
              a.date.split(" ")[0].split(".")[2],
              b.date.split(" ")[0].split(".")[2] -
                a.date.split(" ")[0].split(".")[2]
            );
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
            roomObj.isNotReaded = el.readedThisMessage.includes(
              mongoose.Types.ObjectId(user)
            );
          } else {
            roomObj.isNotReaded = el.isNotReaded;
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
          .catch((e) =>
            res.json({ e: e.message, rooms: [], fullRooms, sortedMessages })
          );
      })
      .catch((e) =>
        res.json({ e: e.message, rooms: [], fullRooms, sortedMessages })
      );
  }
  async getNotReadedRooms(req, res) {
    const user = req.user.userId;

    let rooms1 = await Room.find({ user1: user });
    let rooms2 = await Room.find({ user2: user });
    const rooms = rooms1.concat(rooms2);

    const newRooms = rooms.filter(async (el) => {
      const messages = await Message.find({ room: el._id });
      if (!messages.length) {
        res.json({ msg: "err" });
        return;
      }
      const isNotReaded = messages[messages.length - 1].isNotReaded;
      console.log(isNotReaded, user != messages[messages.length - 1].user);
      return isNotReaded && user != messages[messages.length - 1].user;
    });
    Promise.all(newRooms)
      .then((data) => {
        res.json({ rooms: data });
      })
      .catch((e) => res.json({ rooms: [] }));
  }
  async getRoomsMobile(req, res) {
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
  async getRoom(req, res) {
    const user1 = req.user.userId;
    const user2 = req.params.user2;

    let room = await Room.findOne({ user1, user2 });
    if (!room) {
      room = await Room.findOne({ user1: user2, user2: user1 });
    }
    res.json({ room });
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
  async getRoomById(req, res) {
    const id = req.params.id;
    const room = await Room.findById(id);
    const roomObj = room.toObject();
    if (!roomObj.bg) {
      roomObj.bg = "";
    }
    res.json({ room: roomObj });
  }
  async getMessageStart(req, res) {
    const room = req.params.room;
    let fullRoom = await Room.findById(room);
    if (!fullRoom) fullRoom = await ChatRoom.findById(room);
    const messages = await Message.find({ room });
    const fullMessages = messages.map(async (el) => {
      const message = el.toObject();
      if (!message.message) message.message = "";
      if (!message.to) message.to = "";
      if (!message.fileLink) message.fileLink = "";
      return message;
    });
    Promise.all(fullMessages)
      .then((data) => {
        const filtered = data.filter(
          (v, i, a) =>
            a.findIndex((t) => t.message === v.message && t.date === v.date) ===
            i
        );
        res.json({ messages: filtered });
        res.end();
        return;
      })
      .catch((e) => {
        console.log(e);
        res.json({ messages: [] });
        res.end();
        return;
      });
  }

  async deleteMessage(req, res) {
    const message = await Message.findById(req.params.id);
    await Room.findByIdAndUpdate(message.room, { lastMessage: "" });
    const sameMessages = await Message.find({
      message: message.message,
      date: message.date,
      room: message.room,
    });
    for await (var i of sameMessages) {
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
    res.json({ msg: "deleted" });
  }
  async editMessage(req, res) {
    const message = await Message.findById(req.params.id);
    await Message.findByIdAndUpdate(req.params.id, {
      old: message.message,
      message: req.body.message,
    });

    // await Room.findByIdAndUpdate(message.room, {
    //   lastMessage: req.body.message,
    // });
    res.json({ msg: "updated" });
  }

  async lastMessage(req, res) {
    const lastMessage = req.body.lastMessage;
    console.log(lastMessage);
    const room = req.params.room;

    await Room.findByIdAndUpdate(room, { lastMessage });
    res.json({ msg: "success" });
  }
  async newMessageExists(req, res) {
    const room = req.params.id;

    const messages = await Message.find({ room });
    if (!messages.length) {
      res.json({ msg: "err" });
      return;
    }
    const isNotReaded = messages[messages.length - 1].isNotReaded;
    res.json({ isNotReaded });
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
  async getFullLastMessage(req, res) {
    const id = req.params.id;
    const messages = await Message.find({ room: id });
    if (!messages.length) {
      res.json({ msg: "err" });
      return;
    }
    const lastMessage = messages[messages.length - 1];
    res.json({ fullLastMessage: lastMessage });
  }
  async lastMessageMobile(req, res) {
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
    res.json({ filename });
  }
  async uploadBgMobile(req, res) {
    const filename = uuid.v4() + ".jpg";
    await Room.findByIdAndUpdate(req.params.id, { bg: filename });
    FileService.insertRoomBackground(req.files.file, filename);
    res.json("");
  }
  async user2byRoom(req, res) {
    const room = await Room.findById(req.params.id);
    console.log(
      "ну пипец",
      room.user1.toString(),
      req.params.user,
      room.user1.toString() == req.params.user
    );
    console.log(
      "ну капец",
      room.user2.toString(),
      req.params.user,
      room.user2.toString() == req.params.user
    );
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

  async clear() {
    try {
      // Находим все уникальные комбинации полей message, date, room и user
      const uniqueMessages = await Message.aggregate([
        {
          $group: {
            _id: {
              message: "$message",
              date: "$date",
              room: "$room",
              user: "$user",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      // Удаляем все дубликаты, оставляя только одну запись для каждой уникальной комбинации полей
      uniqueMessages.forEach(async (uniqueMessage) => {
        if (uniqueMessage.count > 1) {
          await Message.deleteMany({
            message: uniqueMessage._id.message,
            date: uniqueMessage._id.date,
            room: uniqueMessage._id.room,
            user: uniqueMessage._id.user,
          });
        }
      });
      console.log("Дубли удалены успешно");
    } catch (err) {
      console.error("Ошибка при удалении дублей:", err);
    }
  }
}

module.exports = new MessengerService();
