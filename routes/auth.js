const { Router } = require("express");

const AuthService = require("../services/AuthService.js");
const { check } = require("express-validator");
const UserService = require("../services/UserService.js");

const admin = require("firebase-admin");

const router = Router();
const auth = require("../middleware/auth.middleware");
const Token = require("../models/Token.js");
const jwt = require("jsonwebtoken");
const { secret, refreshSecret } = require("../config");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const NotificationToken = require("../models/NotificationToken.js");

//Создание роутера для авторизации пользователя
router.get("/new-token/:token", (req, res) => {
  try {
    AuthService.newToken(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/activate/:id/:link", (req, res) => {
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
      res.json({ verified: false, greeting: true });
      return;
    }

    const validated = jwt.verify(refreshToken, refreshSecret);
    if (!validated) {
      res.json({ verified: false, greeting: true });
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
      httpOnly: true,
    });
    res.json({
      verified: true,
      activated: user.isActivated,
      token: accessToken,
      userId: user._id,
      onCourse: user.onCourse,
    });
  } catch (e) {
    console.log(e);
    res.json({ verified: false });
  }
});
router.get("/refresh-mobile", async (req, res) => {
  try {
    let refreshToken = req.headers.authorization.split(" ")[1];

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
      expiresIn: "1m",
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

    res.json({
      verified: true,
      isActivated: user.isActivated,
      token: accessToken,
      userId: user._id,
      user,
      refreshToken,
    });
  } catch (e) {
    console.log(e);
    res.json("");
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
router.get("/allusers", auth, (req, res) => {
  //Все пользователи
  try {
    UserService.getUsers(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/allusers/:page/:search", auth, (req, res) => {
  //Все пользователи c ленивой загрузкой
  try {
    UserService.getUsersLazy(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/load-users", (req, res) => {
  //Все пользователи
  try {
    UserService.loadAllUsers(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/user-by-token", auth, (req, res) => {
  //Один конкретный пользователь
  try {
    UserService.getUserByToken(req, res);
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
router.post("/update-images", auth, (req, res) => {
  try {
    AuthService.updateAvatarAndBanner(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/new-token/:token/:user", async (req, res) => {
  //Один конкретный пользователь
  try {
    const token = req.params.token;

    const fullToken = await NotificationToken.findOne({
      user: req.params.user,
    });
    if (fullToken) {
      fullToken.token = token;
      await fullToken.save();
      res.json({ message: "successs" });
    } else {
      await NotificationToken.create({ token, user: req.params.user });
      res.json({ message: "successs" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/change-password", auth, (req, res) => {
  //Изменение пароля
  try {
    AuthService.changePassword(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/delete-profile-mobile", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.json({ error: "Неверный пароль!" });
      return;
    } else {
      await User.findByIdAndDelete(req.user.userId);
      res.json({ error: "", message: "Пользователь успешно удален" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/send-return-mail/", (req, res) => {
  try {
    AuthService.sendReturnMail(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/return-password", (req, res) => {
  //Редактироавние профиля
  try {
    AuthService.returnPassword(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
