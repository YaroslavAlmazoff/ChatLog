const uuid = require("uuid");
const AEPNotificationToken = require("../../models/AEPNotificationToken");
const AstronomicalEvent = require("../../models/AstronomicalEvent");
const FileService = require("../FileService");
const AstronomicalImage = require("../../models/AstronomicalImage");
const { getMonthNumber } = require("./getMonthNumber");
const { updateUpcomingStatus } = require("./updateUpcomingStatus");

class AEPController {
  async events(req, res) {
    const events = await AstronomicalEvent.find({});
    const currentDateTime = new Date();

    const pastEvents = events
      .filter(
        (event) => new Date(`${event.date}T${event.time}:00Z`) < currentDateTime
      )
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}:00Z`) -
          new Date(`${a.date}T${a.time}:00Z`)
      );

    console.log(pastEvents);

    const upcomingEvents = events
      .filter(
        (event) =>
          new Date(`${event.date}T${event.time}:00Z`) >= currentDateTime
      )
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}:00Z`) -
          new Date(`${b.date}T${b.time}:00Z`)
      );
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
    const date = new Date();
    let { text, month, day, time, interesting, information, visibility } =
      req.body;
    const filename = uuid.v4() + ".png";
    await AstronomicalEvent.create({
      text,
      year: date.getFullYear(),
      month: month.toLowerCase(),
      day,
      time,
      interesting,
      image: filename,
      information,
      visibility,
      date: `${day}.${getMonthNumber(month)}.${year}`,
    });
    FileService.insertAstronomicalEvent(req.files.file, filename);
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
    updateUpcomingStatus();
  }
}

module.exports = new AEPController();
