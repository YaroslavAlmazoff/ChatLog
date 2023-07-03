const { Router } = require("express");

const AuthService = require("../services/AuthService.js");
const { check } = require("express-validator");
const UserService = require("../services/UserService.js");

const router = Router();
const auth = require("../middleware/auth.middleware");
const Token = require("../models/Token.js");
const jwt = require("jsonwebtoken");
const { secret, refreshSecret } = require("../config");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const TokenService = require("../services/TokenService.js");

//Создание роутера для авторизации пользователя
router.get("/new-token/:token", (req, res) => {
  try {
    AuthService.newToken(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/activate/:link", (req, res) => {
  try {
    AuthService.activate(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/deleteprofile", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.json({ error: "Неверный пароль" }).status(400);
      res.end();
      return;
    } else {
      await User.findByIdAndDelete(req.user.userId);
      res.json({ message: "Пользователь успешно удален" });
    }
  } catch (e) {
    console.log(e);
  }
});
router.get("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.json({ verified: false });
      return;
    }

    const validated = jwt.verify(refreshToken, refreshSecret);
    if (!validated) {
      res.json({ verified: false });
      return;
    }

    const accessToken = jwt.sign({ userId: validated.userId }, secret, {
      expiresIn: "1h",
    });
    const newRefreshToken = jwt.sign(
      { userId: validated.userId },
      refreshSecret,
      {
        expiresIn: "30d",
      }
    );

    const token = await Token.findOne({ user: validated.userId });
    if (token) {
      await Token.findByIdAndUpdate(token._id, { token: refreshToken });
    } else {
      await Token.create({ user: validated.userId, token: newRefreshToken });
    }

    const user = await User.findById(validated.userId);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: true,
    });
    res.json({
      verified: true,
      isActivated: user.isActivated,
      token: accessToken,
      userId: user._id,
    });
  } catch (e) {
    console.log(e);
  }
});
router.post("/upload-something", (req, res) => {
  try {
    AuthService.uploadImage(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/upload-bin", (req, res) => {
  try {
    AuthService.uploadBINFile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post(
  "/auth/register",
  [
    check("name", "Имя пользователя не может быть пустым").notEmpty(),
    check("surname", "Фамилия пользователя не может быть пустой").notEmpty(),
    check("email", "Некорректный адрес электронной почты").isEmail(),
    check("password", "Пароль должен быть сильным").isLength({
      min: 5,
      max: 20,
    }),
  ],
  (req, res) => {
    //Регистрация пользователя
    try {
      AuthService.register(req, res);
    } catch (e) {
      console.log(e);
    }
  }
);
router.post(
  "/auth/login",
  [
    check("email", "Некорректный адрес электронной почты").isEmail(),
    check("password", "Пароль должен быть сильным").isLength({
      min: 5,
      max: 20,
    }),
  ],
  (req, res) => {
    //Логин пользователя
    try {
      AuthService.login(req, res);
    } catch (e) {
      console.log(e);
    }
  }
);
router.post(
  "/auth/login-mobile",
  [
    check("email", "Некорректный адрес электронной почты").isEmail(),
    check("password", "Пароль должен быть сильным").isLength({
      min: 5,
      max: 20,
    }),
  ],
  (req, res) => {
    //Логин пользователя
    try {
      AuthService.loginMobile(req, res);
    } catch (e) {
      console.log(e);
    }
  }
);
router.get("/users", (req, res) => {
  //Все пользователи
  try {
    UserService.findAllUsers(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/user", auth, (req, res) => {
  //Один конкретный пользователь
  try {
    UserService.findUser(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/user/:id", (req, res) => {
  //Один конкретный пользователь
  try {
    UserService.findUserById(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/getuserpage/:email", (req, res) => {
  //Получение ID пользователя
  try {
    UserService.getUserID(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/editprofile", auth, (req, res) => {
  //Редактироавние профиля
  try {
    AuthService.update(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/updateprofile", auth, (req, res) => {
  //Редактироавние профиля
  try {
    console.log("WHHAATT");
    AuthService.updateMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
