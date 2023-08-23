const admin = require("firebase-admin");

class FirebaseService {
  send(title, body, token) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Push уведомление успешно отправлено:", response);
      })
      .catch((error) => {
        console.log("Ошибка отправки push-уведомления:", error);
      });
  }
}

module.exports = new FirebaseService();
