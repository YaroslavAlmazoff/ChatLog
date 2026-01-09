const User = require("../models/User");
const UserPost = require("../models/UserPost");
const UserPhoto = require("../models/UserFoto");
const Public = require("../models/Public");
const Notification = require("../models/Notification");

class UserService {
  //Поиск пользователя по ID
  async getUserByToken(req, res) {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  }
  async findUser(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    const userObj = user.toObject();

    const notifications = await Notification.find({ to: id });
    const fullNotifications = notifications.map(async (el) => {
      if (el == null) return null;
      const notificationObj = el.toObject();
      notificationObj.postType = "";
      notificationObj.postID = "";
      return notificationObj;
    });
    const processedNotifications = await Promise.all(fullNotifications);

    const slicedFriends = user.friends.slice(0, 9);
    const friendsInfo = slicedFriends.map(
      async (item) => await User.findById(item)
    );

    const slicedSubscribes = user.subscribes.slice(0, 3);
    const userSubscribes = slicedSubscribes.map(
      async (item) => await Public.findById(item)
    );

    userObj.friendsCount = user.friends.length;
    userObj.subscribesCount = user.subscribes.length;

    const friends = await Promise.all(friendsInfo);
    const subscribes = await Promise.all(userSubscribes);
    const posts = await UserPost.find({ user: id });
    const photos = await UserPhoto.find({ user: id });
    res.json({
      user: userObj,
      posts,
      photos,
      friends,
      subscribes,
      notifications: processedNotifications.reverse(),
    });
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
  async getUsers(req, res) {
    const users = await User.find();
    const mappedUsers = users.map(async (user) => {
      const userObj = user.toObject();
      const notice = await Notification.findOne({
        from: user._id,
        to: req.user.userId,
        type: "friends",
      });
      const notice2 = await Notification.findOne({
        from: req.user.userId,
        to: user._id,
        type: "friends",
      });
      userObj.isFriends = user.friends.includes(req.user.userId);
      userObj.isRequest = notice || notice2;
      return userObj;
    });
    Promise.all(mappedUsers)
      .then((data) => res.json({ users: data }))
      .catch((e) => res.json({ users: [] }));
  }
  async getUsersLazy(req, res) {
    const users = await User.find({});
    users.forEach((user) => {
      console.log(user.name);
    });
    const searchValue = req.params.search;
    console.log(searchValue, searchValue == "all");
    let filteredUsers = users;
    if (searchValue && searchValue != "all") {
      filteredUsers = users.filter(
        (el) =>
          el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          el.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
          el.country.toLowerCase().includes(searchValue.toLowerCase()) ||
          el.city.toLowerCase().includes(searchValue.toLowerCase()) ||
          el.age.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    const mappedUsers = filteredUsers.map(async (user) => {
      const userObj = user.toObject();
      const notice = await Notification.findOne({
        from: user._id,
        to: req.user.userId,
        type: "friends",
      });
      const notice2 = await Notification.findOne({
        from: req.user.userId,
        to: user._id,
        type: "friends",
      });
      userObj.isFriends = user.friends.includes(req.user.userId);
      userObj.isRequest = notice || notice2;
      return userObj;
    });
    Promise.all(mappedUsers)
      .then((data) => {
        const page = parseInt(req.params.page) || 1;
        const perPage = 10;
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;

        const results = data.slice(startIndex, endIndex);
        res.json({
          users: results,
          count: data.length,
          isLast: endIndex >= data.length,
        });
      })
      .catch((e) => res.json({ users: [] }));
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
