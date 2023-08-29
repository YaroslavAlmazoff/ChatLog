const Notification = require("../models/Notification");

//Сервис для уведомлений
class NotificationService {
  //Создание нового уведомления
  async create(user1id, user2id, text, type, postType, postID) {
    await Notification.create({
      title: text,
      type,
      from: user1id,
      to: user2id,
      postType,
      postID,
      checked: false,
    });
  }
  async check(req, res) {
    const user = req.params.id;
    const notifications = await Notification.find({ to: user });
    await Notification.findByIdAndUpdate(
      notifications[notifications.length - 1]._id,
      { checked: true }
    );
    res.json({ msg: "success" });
  }
  //Возращение уведомлений пользователя на клиент
  async notify(req, res) {
    const notifications = await Notification.find({ to: req.params.id });
    const fullNotifications = notifications.map(async (el) => {
      if (el == null) return null;
      const notificationObj = el.toObject();
      notificationObj.postType = "";
      notificationObj.postID = "";
      return notificationObj;
    });
    Promise.all(fullNotifications)
      .then((cms) => {
        const filtered = cms.filter((item) => item != null);
        res.json({ notifications: filtered });
      })
      .catch(() => {
        res.json({ notifications: [] });
      });
  }
  //Удаление уведомления
  async delete(req, res) {
    //Получение ID пользователя и текста уведомления
    const userid = req.user.userId;
    const title = req.params.title;
    //Поиск уведомления
    const needNotice = await Notification.findOne({ to: userid, title });

    if (needNotice == null) {
      console.log("не удалено");
      res.json({ message: "Уведомление не удалено" });
      return;
    }
    //Получение ID нужного уведомления
    const id = needNotice._id;
    //Поиск и удаление уведомления
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Уведомление удалено" });
  }
  async deleteById(req, res) {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
  }
}

module.exports = new NotificationService();
