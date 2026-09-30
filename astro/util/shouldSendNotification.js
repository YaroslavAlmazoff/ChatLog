const { compareStringToEventType } = require("./compareStringToEventType");

function shouldSendNotification(event, user) {
  if (user) {
    if (user.notificationSettings) {
      return (
        user?.notificationSettings?.includes(
          compareStringToEventType(event.text),
        ) ?? true
      );
    } else return true;
  } else return true;
}

module.exports = { shouldSendNotification };
