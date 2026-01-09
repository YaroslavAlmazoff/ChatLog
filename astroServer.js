const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const config = require("config");
const { startNotifications } = require("./services/Astronomical/AEPController");
const serviceAccount = require("./chatlog-astro-firebase-adminsdk-vbdrf-6074f068be.json");
const AEPController = require("./services/Astronomical/AEPController");

const app = express();

app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

app.get("/", (req, res) => {
  res.json({ message: "Работает" });
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
mongoose.connect(config.get("CONNECTION_URL"), { useNewUrlParser: true });
app.listen(4000, async () => {
  console.log("HTTP Server 2 running at http://localhost:4000/");
  await AEPController.copyMeteorShowers();
  setInterval(async () => {
    await startNotifications();
  }, 1 * 60 * 1000);
});
