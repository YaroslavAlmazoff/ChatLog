const ChatRoom = require("../../models/ChatRoom");
const Message = require("../../models/Message");
const User = require("../../models/User");

class MessengerGroupServiceMobile {
  async getRooms(req, res) {
    const user = req.user.userId;
    const rooms = [];
    const allRooms = await ChatRoom.find({});
    allRooms.forEach((room) => {
      room.members.forEach((member) => {
        if (member == user) {
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
    const room = await ChatRoom.findById(req.params.id);
    const finalMembers = room.members;
    finalMembers.push(req.params.user);
    await ChatRoom.findByIdAndUpdate(req.params.id, { members: finalMembers });
    res.json({ msg: "success" });
  }
  async newChatMessage(req, res) {
    const user = await User.findById(req.user.userId);
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
  }

  async editGroup(req, res) {
    let { title } = req.body;
    title = title.replace('"', "");
    title = title.replace('"', "");
    const avatarUrl = uuid.v4() + ".jpg";
    if (req.files) {
      await ChatRoom.findByIdAndUpdate(req.params.id, {
        title,
        avatarUrl,
      });
      await FileService.insertChatAvatar(req.files.file, avatarUrl);
    } else {
      await ChatRoom.findByIdAndUpdate(req.params.id, { title });
    }

    res.json("");
  }
}

module.exports = new MessengerGroupServiceMobile();
