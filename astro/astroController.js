const uuid = require("uuid");
const AstroNotificationToken = require("./models/AstroNotificationToken");
const AstroEvent = require("./models/AstroEvent");
const FileService = require("../services/FileService");
const AstroImage = require("./models/AstroImage");
const { getMonthNumber } = require("./util/getMonthNumber");
const { updateUpcomingStatus } = require("./util/updateUpcomingStatus");
const { getCorrectNumber } = require("./util/getCorrectNumber");

class AstroController {
  async events(req, res) {
    const events = await AstroEvent.find();

    const pastEvents = [];
    const upcomingEvents = [];

    events.forEach((event) => {
      if (event.upcoming) {
        upcomingEvents.push(event);
      } else {
        pastEvents.push(event);
      }
    });

    const currentYear = new Date().getFullYear();

    pastEvents.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split(".").map(Number);
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const dateA = new Date(
        Date.UTC(yearA, monthA - 1, dayA, hoursA, minutesA),
      );

      const [dayB, monthB, yearB] = b.date.split(".").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      const dateB = new Date(
        Date.UTC(yearB, monthB - 1, dayB, hoursB, minutesB),
      );

      return dateB.getTime() - dateA.getTime();
    });

    upcomingEvents.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split(".").map(Number);
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const dateA = new Date(
        Date.UTC(yearA, monthA - 1, dayA, hoursA, minutesA),
      );

      const [dayB, monthB, yearB] = b.date.split(".").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      const dateB = new Date(
        Date.UTC(yearB, monthB - 1, dayB, hoursB, minutesB),
      );

      return dateA.getTime() - dateB.getTime();
    });
    res.json({ future: upcomingEvents, past: pastEvents });
  }
  async uploadImage(req, res) {
    const filename = uuid.v4() + ".jpg";
    let text = req.body.text.replace('"', "");
    text = text.replace('"', "");
    await AstroImage.create({
      imageUrl: filename,
      event: req.params.event,
      text,
    });
    FileService.insertAstronomicalImage(req.files.file, filename);
    res.json("");
  }
  async imagesList(req, res) {
    const images = await AstroImage.find({ event: req.params.event });
    res.json({ images });
  }
  async newEvent(req, res) {
    let {
      text,
      year,
      month,
      day,
      time,
      interesting,
      information,
      visibility,
      type,
      advanced,
    } = req.body;
    const filename = uuid.v4() + ".png";
    await AstroEvent.create({
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
      type,
      advanced,
    });
    await FileService.insertAstronomicalEvent(req.files.file, filename);
    await FileService.insertEventScreenshot(req.files.file2, filename);
    res.json({ message: "OK" });
  }
  async newToken(req, res) {
    try {
      const token = req.params.token;
      const existing = await AstroNotificationToken.findOne({ token });

      if (existing) {
        return res.json({ message: "success!" });
      }

      await AstroNotificationToken.create({ token });
      return res.json({ message: "success!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "error" });
    }
  }
  async startNotifications() {
    await updateUpcomingStatus();
  }

  async copyMeteorShowers() {
    const events = await AstroEvent.find({});

    const updatedEvents = events
      .filter(
        (e) =>
          e.text.includes("Метеорный поток") &&
          e.year === new Date().getFullYear() - 1,
      )
      .map((event) => {
        const e = event.toObject();
        const [day, month, year] = e.date.split(".");

        return {
          ...e,
          _id: undefined,
          year: Number(e.year) + 1,
          date: `${day}.${month}.${Number(year) + 1}`,
          createdAt: undefined,
          updatedAt: undefined,
          notifiedDayBefore: false,
          notifiedHourBefore: false,
          upcoming: true,
        };
      });

    await AstroEvent.insertMany(updatedEvents);
  }

  // async addFields() {
  //   const events = await AstroEvent.find({})
  //   const updatedEvents = event.map(e => {
  //     event = e.toObject()
  //     event.type = null
  //     event.advanced = false

  //     if(event.text.includes("Противостояние")) {
  //       event.type = "opposition"
  //     }
  //   })
  // }
}

module.exports = new AstroController();
