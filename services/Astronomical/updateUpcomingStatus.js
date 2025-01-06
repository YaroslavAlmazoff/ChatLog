const { sendNotifications } = require("./sendNotifications");
const AstronomicalEvent = require("../../models/AstronomicalEvent");

async function updateUpcomingStatus() {
  const events = await AstronomicalEvent.find({ upcoming: true });
  const currentDateTime = new Date();

  for (const event of events) {
    if (event.text === "Транзит тени Титана по диску Сатурна") {
      const [day, month, year] = event.date.trim().split(".").map(Number);
      const [hours, minutes] = event.time.trim().split(":").map(Number);
      const eventDateTime = new Date(
        Date.UTC(year, month - 1, day, hours - 3, minutes)
      );
      console.log(eventDateTime, currentDateTime);
      console.log(eventDateTime <= currentDateTime);

      if (eventDateTime <= currentDateTime) {
        event.upcoming = false;
        await event.save();
        continue;
      }

      const oneDayBefore = new Date(
        eventDateTime.getTime() - 24 * 60 * 60 * 1000
      );
      const oneHourBefore = new Date(eventDateTime.getTime() - 60 * 60 * 1000);
      console.log(
        !event.notifiedDayBefore,
        currentDateTime,
        oneDayBefore,
        currentDateTime >= oneDayBefore,
        !event.notifiedDayBefore && currentDateTime >= oneDayBefore
      );
      console.log(
        !event.notifiedHourBefore,
        currentDateTime,
        oneHourBefore,
        currentDateTime >= oneHourBefore,
        !event.notifiedHourBefore && currentDateTime >= oneHourBefore
      );
      if (!event.notifiedDayBefore && currentDateTime >= oneDayBefore) {
        sendNotifications(event, "day");
        event.notifiedDayBefore = true;
        await event.save();
      } else if (
        !event.notifiedHourBefore &&
        currentDateTime >= oneHourBefore
      ) {
        sendNotifications(event, "hour");
        event.notifiedHourBefore = true;
        await event.save();
      }
    }
  }
}

module.exports = { updateUpcomingStatus };
