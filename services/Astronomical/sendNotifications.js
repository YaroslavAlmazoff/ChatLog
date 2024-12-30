const config = require("config");
const request = require("request");
const AEPNotificationToken = require("../../models/AEPNotificationToken");

async function sendNotifications(item, type) {
  const tokens = await AEPNotificationToken.find({});

  tokens.forEach((el) => {
    const message = {
      to: el.token,
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
    };
    request(
      "https://fcm.googleapis.com/fcm/send",
      {
        method: "POST",
        json: true,
        headers: {
          Authorization: `key=${config.get("AEP_KEY")}`,
        },
        body: message,
      },
      (err, response) => {
        if (err) console.log(err);
        console.log(response);
      }
    );
  });
}

module.exports = { sendNotifications };
