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
        if (
          el.token ==
          "fdsq_qXhT9mzjAXMae9avJ:APA91bE5M42bZH8ZOuFK3w7TFD1LQy4_EbA9sp4unxBqAVxjggdiQ6HnoK8wohW_-y_MlSqoMIYaoQgA7AC2X3xXIBRTMdgD8c6Y4g8K1JJoQWFgEhIODlM"
        ) {
          console.log("Push уведомление успешно отправлено");
        }
      })
      .catch(async (error) => {
        console.log("Ошибка отправки push-уведомления", error, el.token);
        await AEPNotificationToken.deleteOne({ token: el.token });
      });
  });
}

module.exports = { sendNotifications };
