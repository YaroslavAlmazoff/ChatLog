const { compareStringToEventType } = require("./compareStringToEventType");

function shouldSendNotification(event, user) {
  return (
    user.notificationSettings?.includes(compareStringToEventType(event.text)) ??
    true
  );
}

module.exports = { shouldSendNotification };
