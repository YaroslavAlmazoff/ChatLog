const { sendNotifications } = require("./sendNotifications");
const AstronomicalEvent = require("../../models/AstronomicalEvent");

async function updateUpcomingStatus() {
  const events = await AstronomicalEvent.find({ upcoming: true });
  const currentDateTime = new Date();

  for (const event of events) {
    const eventDateTime = new Date(`${event.date}T${event.time}:00Z`);

    if (eventDateTime <= currentDateTime) {
      event.upcoming = false;
      await event.save();
      continue;
    }

    const oneDayBefore = new Date(
      eventDateTime.getTime() - 24 * 60 * 60 * 1000
    );
    console.log(
      !event.notifiedDayBefore,
      currentDateTime,
      oneDayBefore,
      currentDateTime >= oneDayBefore,
      !event.notifiedDayBefore && currentDateTime >= oneDayBefore
    );
    if (!event.notifiedDayBefore && currentDateTime >= oneDayBefore) {
      sendNotifications(event, "day");
      event.notifiedDayBefore = true;
      await event.save();
    }
    const oneHourBefore = new Date(eventDateTime.getTime() - 60 * 60 * 1000);
    console.log(
      !event.notifiedHourBefore,
      currentDateTime,
      oneHourBefore,
      currentDateTime >= oneHourBefore,
      !event.notifiedHourBefore && currentDateTime >= oneHourBefore
    );
    if (!event.notifiedHourBefore && currentDateTime >= oneHourBefore) {
      sendNotifications(event, "hour");
      event.notifiedHourBefore = true;
      await event.save();
    }
  }
}

module.exports = { updateUpcomingStatus };
