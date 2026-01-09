const config = require("config");
const request = require("request");
const admin = require("firebase-admin");
const AEPNotificationToken = require("../../models/AEPNotificationToken");

async function sendNotifications(item, type) {
  const tokens = await AEPNotificationToken.find({});

  tokens.forEach((el) => {
    const message = {
      token: el.token,
      notification: {
        title:
          type === "day"
            ? `Ровно сутки до ${
                item.interesting ? "ИНТЕРЕСНОГО " : ""
              }астрособытия!`
            : `Остался час до ${
                item.interesting ? "ИНТЕРЕСНОГО " : ""
              }астрособытия!`,
        body: item.text,
      },
      android: {
        priority: "high",
      },
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Push уведомление успешно отправлено");
      })
      .catch(async (error) => {
        console.log("Ошибка отправки push-уведомления", error);
        await AEPNotificationToken.deleteOne({ token: el.token });
      });
  });
}

module.exports = { sendNotifications };
