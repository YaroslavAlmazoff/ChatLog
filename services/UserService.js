const fileUpload = require("express-fileupload");
const User = require("../models/User");

//Сервис для взаимодействие с пользователями
class UserService {
  //Поиск пользователя по ID
  async findUser(req, res) {
    const id = req.user.userId;
    const user = await User.findById(id);
    //Возвращение данных пользователя на клиент
    res.json({ user });
  }
  async findUserById(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user == null) {
      res.json({ user: null });
      return;
    }
    const userObj = user.toObject();
    res.json({ user: userObj });
  }
  async checkFriendsFunction(user1id, user2id) {
    const user2 = await User.findById(user2id);
    for (let i = 0; i < user2.friends.length; i++) {
      if (user2.friends[i] == user1id) {
        return true;
      } else {
        return false;
      }
    }
  }
  //Поиск всех пользователей
  async findAllUsers(req, res) {
    const users = await User.find();
    res.json({ users });
  }
  async loadAllUsers(req, res) {
    const users = await User.find();
    const filtered = users.filter(
      (a) =>
        a.name != "dont delete" && a.name != "dont" && a.avatarUrl != "user.png"
    );
    const sliced = filtered.slice(filtered.length - 8);
    res.json({ users: sliced });
  }
  async getUserID(req, res) {
    //Получение ID пользователя
    const user = await User.findOne({ email: req.params.email });
    //Возвращение ID пользователя на клиент
    res.json({ id: user._id });
  }
  async userFriends(req, res) {
    const user = await User.findById(req.user.userId);
    const userFriends = user.friends;
    const friends = userFriends.map(async (el) => {
      const user = await User.findById(el);
      return user;
    });
    Promise.all(friends)
      .then((users) => {
        res.json({ users });
      })
      .catch(() => {
        res.json({ msg: "errors" });
      });
  }
  async get2Users(req, res) {
    const user1 = await User.findById(req.params.user1);
    const user2 = await User.findById(req.params.user2);
    res.json({ user1, user2 });
  }
  async getUserFriends(req, res) {
    const user = await User.findById(req.params.id);

    const fullFriends = user.friends.map(async (el) => {
      const friend = await User.findById(el);
      if (user == null) return null;
      return friend;
    });
    Promise.all(fullFriends)
      .then((cms) => {
        const filtered = cms.filter((item) => item != null);
        res.json({ friends: filtered });
      })
      .catch(() => {
        res.json({ friends: [] });
      });
  }
}

module.exports = new UserService();
