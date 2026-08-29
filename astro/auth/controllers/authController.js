const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/AstroUser");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, jti: Math.random().toString(36).substring(2) + Date.now() },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors
        .array()
        .map((err) => err.msg)
        .join(". "),
    });
  }

  const { email, password } = req.body;

  let user = await User.findOne({ email });
  const isUserExists = !!user;
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      email,
      password: hashedPassword,
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verification code",
      text: `Your verification code is: ${user.verificationCode}`,
    });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env_NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.status(200).json({
    isVerified: user.isVerified,
    refreshToken,
    isUserExists,
    userId: user._id,
    username: user.email.split(".")[0],
    location: user.location,
    favorites: user.favorites,
    notificationSettings: user.notificationSettings,
  });
};

const verify = async (req, res) => {
  const { email, verificationCode, location, favorites, notificationSettings } =
    req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verificationCode !== verificationCode) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.location = location ?? "";
  user.favorites = favorites ?? [];
  user.notificationSettings = notificationSettings ?? [];

  await user.save();

  res
    .status(200)
    .json({ isVerified: true, username: user.email.split(".")[0] });
};

const update = async (req, res) => {
  const { location, favorites, notificationSettings } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found", isSuccessful: false });
  }

  user.location = location ?? "";
  user.favorites = favorites ?? [];
  user.notificationSettings = notificationSettings ?? [];

  await user.save();

  res.status(200).json({ isSuccessful: true });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  if (!user.isVerified) {
    return res
      .status(400)
      .json({ refreshToken: "", message: "User is not verified" });
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env_NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.status(200).json({ refreshToken: newRefreshToken });
};

//добавлен logout

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { firebaseToken: "" });
  res.json({ message: "Success" });
};

module.exports = { login, verify, refresh, logout, update };
