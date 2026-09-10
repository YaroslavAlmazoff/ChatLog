const admin = require("firebase-admin");
const AstroNotificationToken = require("../models/AstroNotificationToken");
const AstroUser = require("../auth/models/AstroUser");
const { shouldSendNotification } = require("./shouldSendNotification");

async function sendNotifications(item, type) {
  const tokens = await AstroNotificationToken.find({});

  tokens.forEach(async (el) => {
    console.log(el);
    const notificationToken = await AstroNotificationToken.findOne({
      token: el.token,
    });
    const user = await AstroUser.findById(notificationToken.userId);

    console.log(
      "Отправлять ли уведомление: ",
      shouldSendNotification(item, user),
    );
    if (shouldSendNotification(item, user)) {
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
          console.log("Отправлено токену ", el.token);
        })
        .catch(async (error) => {
          console.log("Ошибка отправки push-уведомления", el.token);
          // await AEPNotificationToken.deleteOne({ token: el.token });
        });
    }
  });
}

module.exports = { sendNotifications };
