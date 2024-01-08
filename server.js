//Подключение библиотек
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const config = require("config");
const https = require("https");
const http = require("http");
const fs = require("fs");
const subdomain = require("express-subdomain");
const request = require("request");
const cookieParser = require("cookie-parser");

const admin = require("firebase-admin");

//Подключение роутеров
const articlesRouter = require("./routes/articles");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const messagesRouter = require("./routes/messages");
const chatRouter = require("./routes/chatMessages");
const cloudRouter = require("./routes/cloud");
const filesRouter = require("./routes/files");
const adminRouter = require("./routes/admin");
const publicRouter = require("./routes/publics");
const photoRouter = require("./routes/photos");
const innerAdRouter = require("./routes/innerAds");
const adRouter = require("./routes/ads");
const AEPRouter = require("./routes/astronomical/astronomicalEvents");
const mobileRouter = require("./routes/mobile/mobile");
const artShopRouter = require("./routes/art/art");

const videohostChannelsRouter = require("./routes/videohost/channels");
const videohostVideosRouter = require("./routes/videohost/videos");
const videohostUserActionsRouter = require("./routes/videohost/userActions");

const gamesRouter = require("./routes/games");
const storeRouter = require("./routes/store");
const { startNotifications } = require("./services/Astronomical/AEPController");

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

//Создание сервера
const app = express();
//Подключение необходимых middlewares
app.use(cors());
app.use(fileUpload());
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use("/api", articlesRouter);
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", messagesRouter);
app.use("/api/cloud", cloudRouter);
app.use("/api/files", filesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/public", publicRouter);
app.use("/api/photo", photoRouter);
app.use("/api/innerad", innerAdRouter);
app.use("/api/ad", adRouter);
app.use("/api", chatRouter);
app.use("/api/games", gamesRouter);
app.use("/api/store", storeRouter);
app.use("/api/mobile", mobileRouter);
app.use("/api/aep", AEPRouter);
app.use("/api/art", artShopRouter);

app.use("/api/videohost/channels", videohostChannelsRouter);
app.use("/api/videohost/videos", videohostVideosRouter);
app.use("/api/videohost/useractions", videohostUserActionsRouter);

app.enable("trust proxy");
app.use((req, res, next) => {
  req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
});

app.use("/", express.static(path.join(__dirname, "client", "build")));
app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "..", "static")));
app.get("/serviceworker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "serviceworker.js"));
});
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.resolve(__dirname, "manifest.json"));
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const options = {
  key: fs.readFileSync("../chatlog.key", "utf-8"),
  cert: fs.readFileSync("../chatlog.crt", "utf-8"),
};

const serviceAccount = require("./chatloglast-firebase-adminsdk-db7so-4665518e0f.json");
const MessengerService = require("./services/MessengerService");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//Запуск сервера
const start = async () => {
  try {
    //Подключение у базе данных
    mongoose.connect(config.get("CONNECTION_URL"), { useNewUrlParser: true });
    //Прослушивание порта
    http.createServer(app).listen(80);
    https.createServer(options, app).listen(443, () => {
      console.log(`The Server has been started on port 443...`);
    });
    setInterval(() => {
      startNotifications();
      MessengerService.clear();
    }, 540000); //
  } catch (e) {
    console.log("Server Error: ", e.message);
  }
};
start();
