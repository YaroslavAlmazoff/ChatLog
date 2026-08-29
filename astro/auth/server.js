require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const tokenRouter = require("./routes/tokenRouter");
const notificationsRouter = require("./routes/notificationsRouter");
const admin = require("firebase-admin");
const serviceAccount = require("./yalmazoff-social-media-ad766dba8542.json");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
