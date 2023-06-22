const Room = require("../models/Room");
const events = require("events");
const emitter = new events.EventEmitter();
const Message = require("../models/Message");
const User = require("../models/User");
const FileService = require("./FileService");
const uuid = require("uuid");
const ChatRoom = require("../models/ChatRoom");

require("events").EventEmitter.defaultMaxListeners = 15;

class ChatRoomService {
  async createRoom(req, res) {
    const creator = req.user.userId;
    const { title } = req.body;
    const avatarUrl = uuid.v4() + ".jpg";
    const members = [creator];
    if (req.files) {
      await ChatRoom.create({ creator, title, avatarUrl, members });
    } else {
      await ChatRoom.create({ creator, title, avatarUrl, members });
    }

    await FileService.insertChatAvatar(req.files.file, avatarUrl);

    res.json({ msg: "success" });
  }
  async getRooms(req, res) {
    const user = req.user.userId;
    const rooms = [];
    const allRooms = await ChatRoom.find({});
    allRooms.forEach((room) => {
      room.members.forEach((member) => {
        if (member == user || room.creator == user) {
          rooms.push(room);
        }
      });
    });

    const unique = (a) => [...new Set(a)];

    const roomsIds = rooms.map((el) => el._id.toString());
    const uniqueIds = unique(roomsIds);

    const uniqueRooms = uniqueIds.map(async (el) => {
      const room = await ChatRoom.findById(el);
      return room;
    });

    Promise.all(uniqueRooms)
      .then((rooms) => res.json({ rooms }))
      .catch(() => res.json({ msg: "error" }));
  }
  async getRoomsMobile(req, res) {
    const user = req.user.userId;
    const rooms = [];
    const allRooms = await ChatRoom.find({});
    allRooms.forEach((room) => {
      room.members.forEach((member) => {
        if (member == user || room.creator == user) {
          rooms.push(room);
        }
      });
    });

    const unique = (a) => [...new Set(a)];

    const roomsIds = rooms.map((el) => el._id.toString());
    const uniqueIds = unique(roomsIds);

    const uniqueRooms = uniqueIds.map(async (el) => {
      const room = await ChatRoom.findById(el);
      const roomObj = room.toObject();
      const messages = await Message.find({ room: el });
      console.log(el);
      roomObj.read = true;
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        if (lastMessage.readedThisMessage.length) {
          lastMessage.readedThisMessage.forEach((el) => {
            if (user == el) {
              roomObj.read = true;
              roomObj.name = roomObj.title;
              roomObj.avatar = roomObj.avatarUrl;
              return roomObj;
            } else {
              roomObj.read = false;
            }
          });
        }
      }
      roomObj.name = roomObj.title;
      roomObj.avatar = roomObj.avatarUrl;
      return roomObj;
    });

    Promise.all(uniqueRooms)
      .then((rooms) => res.json({ rooms }))
      .catch((e) => {
        console.log(e);
        res.json({ rooms: [] });
      });
  }
  async invite(req, res) {
    const { members } = req.body;
    await ChatRoom.findByIdAndUpdate(req.params.id, { members });
    res.json({ msg: "success" });
  }
  async exclude(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    const members = room.members;
    delete members[members.indexOf(req.params.user)];
    const finalMembers = members.filter((el) => el != null);
    await ChatRoom.findByIdAndUpdate(req.params.id, { members: finalMembers });
  }
  async members(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    res.json({ members: room.members });
  }
  async getRoomById(req, res) {
    const id = req.params.id;
    const room = await ChatRoom.findById(id);
    res.json({ room });
  }
  async getMessageStart(req, res) {
    const room = req.params.room;
    const messages = await Message.find({ room });
    res.json({ messages });
  }
  async getMessage(req, res) {
    emitter.once("newMessage", async (message) => {
      const room = req.params.room;
      const messages = await Message.find({ room });
      res.json({ messages });
    });
  }

  async sendMessage(req, res) {
    const { message, date, isFile } = req.body;
    const room = req.params.room;
    const user = req.user.userId;
    let filename;
    let videofilename;
    if (req.files) {
      if (req.files.file) {
        filename = uuid.v4() + ".jpg";
      }
      if (req.files.videofile) {
        videofilename = uuid.v4() + ".mp4";
      }
    }
    const USER = await User.findById(user);
    await Message.create({
      message,
      name: USER.name,
      avatarUrl: USER.avatarUrl,
      date,
      user,
      room,
      isNotReaded: false,
      isFile,
      imageUrl: filename,
      videoUrl: videofilename,
      readedThisMessage: [user],
    }).then(() => {
      //Когда новое сообщение создалось в базе данных, получение ID сообщения и загрузка изображения на диск
      Message.findOne({ date }).then((newValue) => {
        const id = newValue._id;
        if (req.files) {
          if (req.files.file) {
            FileService.insertMessageFoto(req.files.file, id, filename);
          }
          if (req.files.videofile) {
            FileService.insertMessageVideo(
              req.files.videofile,
              id,
              videofilename
            );
          }
        }
        res.json({ id });
      });
    });

    emitter.emit("newMessage", message);
    res.status(200);
  }

  async deleteMessage(req, res) {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: "deleted" });
  }
  async editMessage(req, res) {
    await Message.findByIdAndUpdate(req.params.id, {
      message: req.body.message,
    });
    res.json({ msg: "updated" });
  }

  async lastMessage(req, res) {
    const lastMessage = req.body.lastMessage;
    const room = req.params.room;

    await ChatRoom.findByIdAndUpdate(room, { lastMessage });
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
    const roomId = req.params.id;
    const userid = req.user.userId;

    const messages = await Message.find({ room: roomId });
    if (!messages[messages.length - 1]) {
      res.json({ msg: "err" });
      return;
    }
    const lastMessage = messages[messages.length - 1];

    const readedThisMessage = lastMessage.readedThisMessage;
    readedThisMessage.push(userid);

    await Message.findByIdAndUpdate(lastMessage._id, { readedThisMessage });
    res.json({ msg: "success" });
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
  async fullMembers(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    const roomMembers = room.members;
    const members = roomMembers.map(async (el) => {
      const member = await User.findById(el);
      return member;
    });
    Promise.all(members)
      .then((fullMembers) => {
        res.json({ members: fullMembers });
      })
      .catch(() => {
        res.json({ msg: "errors" });
      });
  }
  async uploadBg(req, res) {
    const filename = uuid.v4() + ".jpg";
    await Room.findByIdAndUpdate(req.params.id, { bg: filename });
    FileService.insertRoomBackground(req.files.file, filename);
    res.json({ filename });
  }
}

module.exports = new ChatRoomService();
