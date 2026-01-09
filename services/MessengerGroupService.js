const events = require("events");
const uuid = require("uuid");
const File = require("../models/File");
const Message = require("../models/Message");
const User = require("../models/User");
const FileService = require("./FileService");
const FirebaseService = require("./FirebaseService");
const ChatRoom = require("../models/ChatRoom");
const NotificationToken = require("../models/NotificationToken");
const Utils = require("../utils/Utils");

const emitter = new events.EventEmitter();

class MessengerGroupService {
  async createRoom(req, res) {
    const creator = req.user.userId;
    let { title } = req.body;
    title = title.replace('"', "");
    title = title.replace('"', "");
    const avatarUrl = uuid.v4() + ".jpg";
    const members = [creator];

    if (req.files) {
      await ChatRoom.create({ creator, title, members, avatarUrl });
      await FileService.insertChatAvatar(req.files.file, avatarUrl);
    } else {
      await ChatRoom.create({ creator, title, members });
    }

    res.json("");
  }

  async getRoom(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    const roomObj = room.toObject();
    const fullMembers = roomObj.members.map(
      async (member) => await User.findById(member)
    );
    roomObj.members = await Promise.all(fullMembers);
    res.json({ room: roomObj });
  }

  async changeTitle(req, res) {
    const { title } = req.body;
    await ChatRoom.findByIdAndUpdate(req.params.id, { title });
    res.json({ title });
  }

  async changeAvatar(req, res) {
    const avatarUrl = uuid.v4() + ".jpg";
    await FileService.insertChatAvatar(req.files.file, avatarUrl);
    await ChatRoom.findByIdAndUpdate(req.params.id, { avatarUrl });
    res.json({ avatarUrl });
  }

  async invite(req, res) {
    const { room, user } = req.body;
    const chatRoom = await ChatRoom.findById(room);
    chatRoom.members = [...chatRoom.members, user];
    await chatRoom.save();
    res.json({ msg: "success" });
  }

  async exclude(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    if (room.creator == req.user.userId) {
      const members = room.members;
      delete members[members.indexOf(req.params.user)];
      const finalMembers = members.filter((el) => el != null);
      await ChatRoom.findByIdAndUpdate(req.params.id, {
        members: finalMembers,
      });
      res.json({ errors: [] });
    } else {
      res.json({ errors: ["Недостаточно прав для исключения пользователя"] });
    }
  }
  async leave(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    console.log(room, room.members.includes(req.user.userId));
    if (room.members.includes(req.user.userId)) {
      const members = room.members;
      delete members[members.indexOf(req.user.userId)];
      const finalMembers = members.filter((el) => el != null);
      await ChatRoom.findByIdAndUpdate(req.params.id, {
        members: finalMembers,
      });
      res.json({ errors: [] });
    } else {
      res.json({ errors: ["Недостаточно прав для исключения пользователя"] });
    }
  }
  async remove(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    if (req.user.userId == room.creator) {
      await ChatRoom.findByIdAndDelete(req.params.id);
      res.json({ errors: [] });
    } else {
      res.json({ errors: ["Недостаточно прав для удаления"] });
    }
  }
  async editGroup(req, res) {
    let { title, description } = req.body;
    await ChatRoom.findByIdAndUpdate(req.params.id, { title, description });
    res.json("");
  }
  async members(req, res) {
    const room = await ChatRoom.findById(req.params.id);
    res.json({ members: room.members });
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
    if (!readedThisMessage.includes(userid)) {
      readedThisMessage.push(userid);
      await Message.findByIdAndUpdate(lastMessage._id, { readedThisMessage });
    }
    res.json({ msg: "success" });
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
        res.json({ members: fullMembers.filter((el) => el != null) });
      })
      .catch(() => {
        res.json({ members: [] });
      });
  }
  async uploadBg(req, res) {
    const filename = uuid.v4() + ".jpg";
    await ChatRoom.findByIdAndUpdate(req.params.id, { bg: filename });
    FileService.insertRoomBackground(req.files.file, filename);
    res.json({ filename });
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
        images: { $eq: message.oldImages },
        videos: { $eq: message.oldVideos },
        message: message.message,
        date: message.date,
      });
      if (!existingMessage) {
        const created = new Message(message);
        const saveMessage = async () => {
          await created.save();
        };
        emitter.once("group-save-message", saveMessage);
        emitter.emit("group-save-message");
        emitter.off("group-save-message", saveMessage);
        await ChatRoom.findByIdAndUpdate(message.room, {
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

    emitter.on("groupMessages", messages);
    emitter.on("groupNewMessage", newMessage);
    emitter.on("groupDeleteMessage", deleteMessage);
    emitter.on("groupEditMessage", editMessage);

    req.on("close", () => {
      emitter.off("groupMessages", messages);
      emitter.off("groupNewMessage", newMessage);
      emitter.off("groupDeleteMessage", deleteMessage);
      emitter.off("groupEditMessage", editMessage);
    });
  }

  async messages(req, res) {
    console.log("groupMessages");
    emitter.emit(
      "groupMessages",
      req.params.page,
      req.params.offset,
      req.user.userId
    );
    res.json({ message: "да" });
  }

  async newMessage(req, res) {
    req.setTimeout(60 * 1000);
    const user = await User.findById(req.user.userId);
    const room = await ChatRoom.findById(req.params.id);

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
    message.readedThisMessage = [req.user.userId];

    const tokens = [];

    const tkns = room.members.map(async (user) => {
      const token = await NotificationToken.findOne({ user });
      if (token) tokens.push(token.token);
    });

    Promise.all(tkns).then((data) => {
      FirebaseService.sendMulticast(
        user.name + " " + user.surname,
        message.message,
        tokens.filter((value) => value != req.user.userId),
        {
          id: room._id.toString(),
          type: "chatmessage",
          message: message.message,
          name: room.title,
          click_action: "CHAT",
        }
      );
    });

    if (
      message.fileLink == null ||
      message.fileLink == "null" ||
      message.fileLink == ""
    ) {
      message.fileLink = "";
    } else {
      await File.findByIdAndUpdate(message.fileLink, { public: true });
    }
    emitter.emit("groupNewMessage", message);
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
        emitter,
        true
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
        emitter,
        true
      );
    } else {
      res.json({ id });
    }
  }
}

module.exports = new MessengerGroupService();
