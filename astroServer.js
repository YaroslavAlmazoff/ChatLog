const express = require("express");
const cors = require("cors");
const { startNotifications } = require("./services/Astronomical/AEPController");

const app = express();

app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Работает" });
});

app.listen(4000, () => {
  console.log("HTTP Server 2 running at http://localhost:4000/");
  setInterval(async () => {
    await startNotifications();
  }, 60 * 1000);
});
