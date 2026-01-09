const admin = require("firebase-admin");

class FirebaseService {
  send(title, body, token, data) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      android: {
        priority: "high",
      },
      data,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Push уведомление успешно отправлено");
      })
      .catch((error) => {
        console.log("Ошибка отправки push-уведомления");
      });
  }

  sendMulticast(title, body, tokens, data) {
    tokens.forEach((token) => {
      const message = {
        token,
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
        },
        data,
      };
      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Push уведомление успешно отправлено");
        })
        .catch((error) => {
          console.log("Ошибка отправки push-уведомления");
        });
    });
  }
}

module.exports = new FirebaseService();
