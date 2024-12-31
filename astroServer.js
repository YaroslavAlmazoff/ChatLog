const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { startNotifications } = require("./services/Astronomical/AEPController");
const serviceAccount = require("./chatlog-astro-firebase-adminsdk-vbdrf-6074f068be.json");

const app = express();

app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Работает" });
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.listen(4000, () => {
  console.log("HTTP Server 2 running at http://localhost:4000/");
  setInterval(async () => {
    console.log("Start notifications");
    await startNotifications();
  }, 1 * 60 * 1000);
});
