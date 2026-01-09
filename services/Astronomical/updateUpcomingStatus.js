const { sendNotifications } = require("./sendNotifications");
const AstronomicalEvent = require("../../models/AstronomicalEvent");

async function updateUpcomingStatus() {
  const events = await AstronomicalEvent.find({ upcoming: true });
  const currentDateTime = new Date();

  for (const event of events) {
    const [day, month, year] = event.date.trim().split(".").map(Number);
    const [hours, minutes] = event.time.trim().split(":").map(Number);
    const eventDateTime = new Date(
      Date.UTC(year, month - 1, day, hours - 3, minutes)
    );

    if (eventDateTime <= currentDateTime) {
      event.upcoming = false;
      await event.save();
      continue;
    }

    const oneDayBefore = new Date(
      eventDateTime.getTime() - 24 * 60 * 60 * 1000
    );
    const oneHourBefore = new Date(eventDateTime.getTime() - 60 * 60 * 1000);
    if (!event.notifiedDayBefore && currentDateTime >= oneDayBefore) {
      sendNotifications(event, "day");
      event.notifiedDayBefore = true;
      await event.save();
    } else if (!event.notifiedHourBefore && currentDateTime >= oneHourBefore) {
      sendNotifications(event, "hour");
      event.notifiedHourBefore = true;
      await event.save();

      if (event.includes("Метеорный поток")) {
        const [day, month, year] = event.date.split(".");

        const newEvent = {
          ...event,
          _id: undefined,
          year: Number(event.year) + 1,
          date: `${day}.${month}.${Number(year) + 1}`,
          createdAt: undefined,
          updatedAt: undefined,
          notifiedDayBefore: false,
          notifiedHourBefore: false,
          upcoming: true,
        };

        await AstronomicalEvent.create(newEvent);
      }
    }
  }
}

module.exports = { updateUpcomingStatus };
