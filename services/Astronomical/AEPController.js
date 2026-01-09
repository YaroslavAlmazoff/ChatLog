const uuid = require("uuid");
const AEPNotificationToken = require("../../models/AEPNotificationToken");
const AstronomicalEvent = require("../../models/AstronomicalEvent");
const FileService = require("../FileService");
const AstronomicalImage = require("../../models/AstronomicalImage");
const { getMonthNumber } = require("./getMonthNumber");
const { updateUpcomingStatus } = require("./updateUpcomingStatus");
const { getCorrectNumber } = require("./getCorrectNumber");

class AEPController {
  async events(req, res) {
    const events = await AstronomicalEvent.find(); // Получаем все события из базы данных

    // Разделяем события
    const pastEvents = [];
    const upcomingEvents = [];

    events.forEach((event) => {
      if (event.upcoming) {
        // Если событие прошло
        upcomingEvents.push(event);
      } else {
        // Если событие еще впереди
        pastEvents.push(event);
      }
    });

    const currentYear = new Date().getFullYear();

    // Сортируем массивы
    pastEvents.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split(".").map(Number);
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const dateA = new Date(
        Date.UTC(yearA, monthA - 1, dayA, hoursA, minutesA)
      );

      const [dayB, monthB, yearB] = b.date.split(".").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      const dateB = new Date(
        Date.UTC(yearB, monthB - 1, dayB, hoursB, minutesB)
      );

      return dateB.getTime() - dateA.getTime(); // Сортировка по убыванию
    });

    upcomingEvents.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split(".").map(Number);
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const dateA = new Date(
        Date.UTC(yearA, monthA - 1, dayA, hoursA, minutesA)
      );

      const [dayB, monthB, yearB] = b.date.split(".").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      const dateB = new Date(
        Date.UTC(yearB, monthB - 1, dayB, hoursB, minutesB)
      );

      return dateA.getTime() - dateB.getTime();
    });
    res.json({ future: upcomingEvents, past: pastEvents });
  }
  async uploadImage(req, res) {
    const filename = uuid.v4() + ".jpg";
    let text = req.body.text.replace('"', "");
    text = text.replace('"', "");
    await AstronomicalImage.create({
      imageUrl: filename,
      event: req.params.event,
      text,
    });
    FileService.insertAstronomicalImage(req.files.file, filename);
    res.json("");
  }
  async imagesList(req, res) {
    const images = await AstronomicalImage.find({ event: req.params.event });
    res.json({ images });
  }
  async newEvent(req, res) {
    let { text, year, month, day, time, interesting, information, visibility } =
      req.body;
    const filename = uuid.v4() + ".png";
    await AstronomicalEvent.create({
      text,
      year,
      month: month.toLowerCase(),
      day,
      time,
      interesting,
      image: filename,
      information,
      visibility,
      date: `${getCorrectNumber(`${day}`)}.${getMonthNumber(month)}.${year}`,
    });
    await FileService.insertAstronomicalEvent(req.files.file, filename);
    await FileService.insertEventScreenshot(req.files.file2, filename);
    res.json({ message: "OK" });
  }
  async newToken(req, res) {
    const token = req.params.token;
    const tokens = await AEPNotificationToken.find({});
    let tokenExists = false;
    tokens.forEach((item) => {
      if (item.token === token) {
        tokenExists = true;
        res.json({ m: "token exists" });
        return;
      }
    });
    if (!tokenExists) {
      await AEPNotificationToken.create({ token });
      res.json({ message: "success!" });
    }
  }
  async startNotifications() {
    await updateUpcomingStatus();
  }

  async copyMeteorShowers() {
    const events = await AstronomicalEvent.find({});

    const updatedEvents = events.map((event) => {
      const [day, month, year] = event.date.split(".");

      const ev = event.text.includes("Метеорный поток")
        ? {
            ...event,
            _id: undefined,
            year: Number(event.year) + 1,
            date: `${day}.${month}.${Number(year) + 1}`,
            createdAt: undefined,
            updatedAt: undefined,
            notifiedDayBefore: false,
            notifiedHourBefore: false,
            upcoming: true,
          }
        : event;

      return ev;
    });

    await AstronomicalEvent.insertMany(updatedEvents);
  }
}

module.exports = new AEPController();
