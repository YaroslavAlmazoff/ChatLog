const Notification = require("../models/Notification");
const NotificationToken = require("../models/NotificationToken");
const User = require("../models/User");
const NotificationService = require("./NotificationService");
const FirebaseService = require("../services/FirebaseService");
class FriendsService {
  async getFriends(req, res) {
    const user = await User.findById(req.params.id);
    const friends = user.friends.map(async (item) => await User.findById(item));
    Promise.all(friends).then((data) => res.json({ friends: data }));
  }
  async makeFriends(req, res) {
    const user1id = req.user.userId;
    const user2id = req.params.to;
    const user1 = await User.findById(user1id);
    const user2 = await User.findById(user2id);
    user2.friends.forEach((el) => {
      if (el == user1id) {
        res.json({
          message:
            "Пользователь, которому вы отправляете заявку в друзья уже у вас в друзьях.",
        });
        res.end();
        return;
      }
    });
    const text = `${user1.name} ${user1.surname} хочет добавить вас в друзья.`;
    NotificationService.create(user1id, user2id, text, "friends", "user");
    console.log(user1id, user2id);
    const token = await NotificationToken.findOne({ user: user2id });
    console.log(token);
    if (token) {
      FirebaseService.send(text, "", token.token, {
        id: user1id,
        type: "mf",
        message: text,
        name: "",
        click_action: "USER",
      });
    }
    res.json({ msg: "success" });
  }
  async deleteFriend(req, res) {
    const { showedFriends } = req.body;
    const user1id = req.user.userId;
    const user2id = req.params.to;
    const user1 = await User.findById(user1id);
    const user2 = await User.findById(user2id);
    let user1friends = user1.friends;
    const deletingFriendNumber1 = user1.friends.indexOf(user2id);
    delete user1friends[deletingFriendNumber1];
    user1friends = user1friends.filter((el) => el != null);
    let user2friends = user2.friends;
    const deletingFriendNumber2 = user2.friends.indexOf(user1id);
    delete user2friends[deletingFriendNumber2];
    user2friends = user2friends.filter((el) => el != null);
    await User.findByIdAndUpdate({ _id: user1id }, { friends: user1friends });
    await User.findByIdAndUpdate({ _id: user2id }, { friends: user2friends });
    const text = `К сожалению, ${user1.name} ${user1.surname} удалил вас из друзей`;
    NotificationService.create(user1id, user2id, text, "delete", "user");
    let notification = await Notification.findOne({
      from: user1id,
      to: user2id,
      type: "friends",
    });
    if (!notification) {
      notification = await Notification.findOne({
        from: user2id,
        to: user1id,
        type: "friends",
      });
    }

    const token = await NotificationToken.findOne({ user: user2id });
    FirebaseService.send("", text, token.token, {
      id: user1id,
      type: "df",
      message: "",
      name: "",
      click_action: "USER",
    });

    const correctFriends = user1friends.filter(
      (friend) => !showedFriends.includes(friend)
    );
    const friend = correctFriends.length
      ? await User.findById(
          correctFriends[Math.round(Math.random * correctFriends.length - 1)]
        )
      : null;

    if (!notification) {
      res.json({ friends: user1friends, friend });
    } else {
      const id = notification._id;
      await Notification.findByIdAndDelete(id);
      res.json({ friends: user1friends, friend });
    }
  }
  async cancelFriendsRequest(req, res) {
    await Notification.findOneAndDelete({
      from: req.user.userId,
      to: req.params.id,
      type: "friends",
    });
    res.json({ message: "request deleted successfully" });
  }
  async reply(req, res) {
    //Извлечение ID пользователей
    const user1id = req.user.userId;
    const user2id = req.params.to;
    //Поиск пользователей
    const user1 = await User.findById(user1id);
    const user2 = await User.findById(user2id);
    //Добавление пользователя 2 в друзья пользователю 1
    const user1friends = user1.friends;
    user1friends.push(user2id);
    //Добавление пользователя 1 в друзья пользователю 2
    const user2friends = user2.friends;
    user2friends.push(user1id);
    //Обновление поля друзей у пользователей
    await User.findByIdAndUpdate({ _id: user1id }, { friends: user1friends });
    await User.findByIdAndUpdate({ _id: user2id }, { friends: user2friends });
    //Создание уведомления о том что пользователь принял заявку
    const text = `Ваша заявка в друзья к ${user1.name} ${user1.surname} была принята.`;
    NotificationService.create(user2id, user1id, text, "reply", "user");
    //Удаление заявки в друзья
    await Notification.deleteOne({ from: user2id, to: user1id });

    const token = await NotificationToken.findOne({ user: user2id });
    if (token) {
      FirebaseService.send(text, "", token.token, {
        id: user1id,
        type: "reply",
        message: text,
        name: "",
        click_action: "USER",
      });
    }
    res.json({ friends: user1friends });
  }
  async reject(req, res) {
    //Извлечение ID пользователей
    const user1id = req.params.from;
    const user2id = req.params.to;
    //Поиск пользователей
    const user1 = await User.findById(user1id);
    const user2 = await User.findById(user2id);
    //Создание уведомления о том что заявка пользователя 2 пользователю 1 была отклонена
    const text = `К сожалению, ваша заявка в друзья к ${user1.name} ${user1.surname} была отклонена.`;
    NotificationService.create(user2id, user1id, text, "reject", "user");
    //Удаление заявки в друзья
    await Notification.deleteOne({ from: user2id, to: user1id });
    const token = await NotificationToken.findOne({ user: user2id });
    FirebaseService.send(text, "", token.token, {
      id: user1id,
      type: "reject",
      message: text,
      name: "",
      click_action: "USER",
    });
    res.json({ message: "Success!" });
  }
  async checkFriends(req, res) {
    //Извлечение ID пользователей
    const user1id = req.user.userId;
    const user2id = req.params.to;
    //Поиск пользователей
    const user1 = await User.findById(user1id);
    const user2 = await User.findById(user2id);
    //Проверка, есть ли у пользователя 2 в друзьях пользователь 1
    for (let i = 0; i < user2.friends.length; i++) {
      if (user2.friends[i] == user1id) {
        //Если да, возвращение на клиент true
        console.log(true);
        res.json({ message: true });
        return;
      } else {
        //Если нет, возвращение на клиент false
        console.log(false);
        res.json({ message: false });
        return;
      }
    }
  }
  async checkNotifications(req, res) {
    //Извлечение ID пользователей
    const user1id = req.user.userId;
    const user2id = req.params.to;
    //Поиск уведомления
    const notice = await Notification.findOne({
      from: user1id,
      to: user2id,
      type: "friends",
    });
    const notice2 = await Notification.findOne({
      from: user2id,
      to: user1id,
      type: "friends",
    });
    //Проверка есть ли такое уведомление
    if (notice || notice2) {
      //Если да, возвращение на клиент true
      res.json({ message: true });
    } else {
      //Если нет, возвращение на клиент false
      res.json({ message: false });
    }
  }

  async get9Friends(req, res) {
    const user = await User.findById(req.params.id);
    const top9Friends = user.friends.slice(0, 9);
    const friendsInfo = top9Friends.map(
      async (item) => await User.findById(item)
    );
    Promise.all(friendsInfo).then((data) =>
      res.json({ friends: data.filter((el) => el != null) })
    );
  }
}

module.exports = new FriendsService();
