const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const fs = require("fs");
const { secret, refreshSecret } = require("../config");
const FileService = require("./FileService");
const ImageService = require("./ImageService");
const Token = require("../models/Token");
const MailService = require("./MailService");
const TokenService = require("./TokenService");
const NotificationToken = require("../models/NotificationToken");
const path = require("path");

//Сервис авторизации пользователя
class AuthService {
  async newToken(req, res) {
    res.json({ msg: "efe" });
  }
  async uploadImage(req, res) {
    await ImageService.saveFile(req.files.file, req.body.name, req.body.folder);
    res.json({ message: "yra" });
  }
  async uploadBINFile(req, res) {
    await ImageService.saveBINFile(req.files.file, req.files.file.name);
    res.json({ message: "yra" });
  }
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors }).status(400);
      }
      const {
        name,
        surname,
        age,
        email,
        country,
        city,
        password,
        site,
        onCourse,
      } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ errors: ["Пользователь с таким email уже зарегистрирован"] });
      }

      const hashPassword = bcrypt.hashSync(password);

      const user = await User.create({
        name,
        surname,
        age,
        email,
        country,
        city,
        password: hashPassword,
        onCourse,
        courseMemberID: uuid.v4().split("-")[0],
      });

      const { token, refreshToken } = TokenService.generateTokens({
        userId: user._id,
      });

      const tokenData = await Token.findOne({ user: user._id });
      if (tokenData) {
        tokenData.token = refreshToken;
        await tokenData.save();
      }

      const link = uuid.v4();

      await MailService.sendActivationLink(
        email,
        `https://chatlog.ru/api/activate/${user._id}/${link}`,
      );

      user.link = link;
      await user.save();

      if (!site) {
        const firebaseToken = req.body.token;

        const fullToken = await NotificationToken.findOne({
          user: user._id,
        });
        if (fullToken) {
          fullToken.token = firebaseToken;
          await fullToken.save();
        } else {
          await NotificationToken.create({
            token: firebaseToken,
            user: user._id,
          });
        }
      }

      fs.mkdir(`../static/userfiles/${user._id}`, (err) => {
        console.log(err);
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json({
        user,
        message: "Success register!",
        userId: user._id,
        token,
        refreshToken,
        errors: [],
      });
    } catch (e) {
      console.log(e);
      res.json({ errors: ["Ошибка"] });
    }
  }
  //Обновление профиля пользователя
  async update(req, res) {
    try {
      console.log("in update");
      //Получение результата валидации данных пользователя
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //Отправка ошибок, если она есть
        res.json({ errors }).status(400);
      }
      //Получение данных пользователя из тела запроса
      let { name, surname, age, email, aboutMe, city, country } = req.body;
      console.log(name, surname, age, email, aboutMe, city, country);
      //Получение ID пользователя
      const id = req.user.userId;
      const filename1 = uuid.v4() + ".jpg";
      const filename2 = uuid.v4() + ".jpg";
      //Обновление профиля пользователя
      await User.findByIdAndUpdate(
        { _id: id },
        { name, surname, age, email, aboutMe, city, country },
      );
      //Загрузка или обновление изображений аватарки и баннера
      if (req.files) {
        if (req.files.file) {
          //Генерирование нового имени для файла аватарки
          //Загрузка аватарки на сервер
          await FileService.insertUserAvatar(req.files.file, id, filename1);
          //Обновление аватарки
          const user = await User.findById(id);
          if (user.avatarUrl != "user.png" && user.avatarUrl != "") {
            const filePath = path.resolve(
              "..",
              "static",
              "useravatars",
              user.avatarUrl,
            );
            fs.access(filePath, fs.constants.F_OK, async (err) => {
              if (err) {
                console.error("Файл не существует");
              } else {
                await ImageService.deleteFile(filePath);
              }
            });
          }
          user.avatarUrl = filename1;
          await user.save();
        }
        if (req.files.file2) {
          //Генерирование нового имени для файла баннера
          //Загрузка баннера на сервер
          await FileService.insertUserBanner(req.files.file2, id, filename2);
          //Обновление баннера
          const user = await User.findById(id);
          if (user.bannerUrl != "banner.png" && user.bannerUrl != "") {
            const filePath = path.resolve(
              "..",
              "static",
              "userbanners",
              user.bannerUrl,
            );
            fs.access(filePath, fs.constants.F_OK, async (err) => {
              if (err) {
                console.error("Файл не существует");
              } else {
                await ImageService.deleteFile(filePath);
              }
            });
          }
          user.bannerUrl = filename2;
          await user.save();
        }
      }
      let avatarExists = false;
      let bannerExists = false;

      if (req.files) {
        if (req.files.file) {
          avatarExists = true;
        }
        if (req.files.file2) {
          bannerExists = true;
        }
      }
      if (avatarExists && bannerExists) {
        res.json(
          JSON.stringify({ avatarUrl: filename1, bannerUrl: filename2 }),
        );
      } else if (avatarExists && !bannerExists) {
        res.json(JSON.stringify({ avatarUrl: filename1, bannerUrl: "" }));
      } else if (bannerExists && !avatarExists) {
        res.json(JSON.stringify({ avatarUrl: "", bannerUrl: filename2 }));
      } else {
        res.json(JSON.stringify({ avatarUrl: "", bannerUrl: "" }));
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ e });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ errors }).status(400);
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ errors: ["Такого пользователя не существует"] });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.json({ errors: ["Пароль не верный"] }).status(400);
      }
      const { token, refreshToken } = TokenService.generateTokens({
        userId: user._id,
      });

      const tokenData = await Token.findOne({ user: user._id });
      if (tokenData) {
        tokenData.token = refreshToken;
        await tokenData.save();
      }
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
      });
      res.json({ user, token, userId: user._id, errors: [] });
    } catch (e) {
      console.log(e);
      res.json({ errors: ["Ошибка"] });
    }
  }
  async loginMobile(req, res) {
    try {
      console.log("login");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ errors }).status(400);
        res.end();
        return;
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.json({ errors: ["Такого пользователя не существует"] });
        res.end();
        return;
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        res.json({ errors: ["Пароль не верный"] }).status(400);
        res.end();
        return;
      }
      const { token, refreshToken } = TokenService.generateTokens({
        userId: user._id,
      });
      const tokenData = await Token.findOne({ user: user._id });
      if (tokenData) {
        tokenData.token = refreshToken;
        await tokenData.save();
      }

      const firebaseToken = req.body.token;

      const fullToken = await NotificationToken.findOne({
        user: user._id,
      });
      if (fullToken) {
        fullToken.token = firebaseToken ? firebaseToken : fullToken.token;
        await fullToken.save();
      } else {
        await NotificationToken.create({
          token: firebaseToken,
          user: user._id,
        });
      }

      res.json({ token, refreshToken, userId: user._id, user, errors: [] });
    } catch (e) {
      console.log(e);
      res.status(400).json({ e });
    }
  }
  async activate(req, res) {
    const user = await User.findById(req.params.id);
    const { refreshToken } = req.cookies;
    if (user.link == req.params.link) {
      user.isActivated = true;
      user.save();
      if (refreshToken) {
        res.redirect("/home");
      } else {
        res.json({ message: "Успешная Активация" });
      }
    } else {
      res.json({ message: "Ошибка: ссылка не совпадает." });
    }
  }
  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    const isValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isValid) {
      res.json({ error: "Неверный пароль!" });
      return;
    }
    const hashedPassword = bcrypt.hashSync(newPassword);
    await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword });
    res.json({ error: "" });
  }
  async sendReturnMail(req, res) {
    const { email } = req.body;
    const link = uuid.v4();
    const user = await User.findOneAndUpdate({ email }, { returnLink: link });
    await MailService.sendReturnLink(
      email,
      "https://chatlog.ru/return-password/" + user._id + "/" + link,
    );
    res.json("ok");
  }
  async returnPassword(req, res) {
    const { password, id, link } = req.body;
    const user = await User.findById(id);
    if (user.returnLink != link) {
      res.json({ error: "Доступ запрещен!", ok: false });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.json({ error: "", ok: true });
  }

  async updateAvatarAndBanner(req, res) {
    try {
      const id = req.user.userId;
      console.log(id);
      const filename1 = uuid.v4() + ".jpg";
      const filename2 = uuid.v4() + ".jpg";
      const avatarExists = JSON.parse(req.body.avatarExists);
      const bannerExists = JSON.parse(req.body.bannerExists);
      console.log(avatarExists, bannerExists);
      //Загрузка или обновление изображений аватарки и баннера
      if (req.files) {
        console.log(req.files);
        // console.log(req.files.avatar);
        // console.log(req.files.banner);
        if (avatarExists) {
          console.log("create avatar");
          await FileService.insertUserAvatar(req.files.avatar, id, filename1);
          const user = await User.findById(id);
          if (user.avatarUrl != "user.png" && user.avatarUrl != "") {
            const filePath = path.resolve(
              "..",
              "static",
              "useravatars",
              user.avatarUrl,
            );
            fs.access(filePath, fs.constants.F_OK, async (err) => {
              if (err) {
                console.error("Файл не существует");
              } else {
                await ImageService.deleteFile(filePath);
              }
            });
          }
          user.avatarUrl = filename1;
          await user.save();
        } else if (bannerExists) {
          console.log("create banner");
          await FileService.insertUserBanner(req.files.banner, id, filename2);
          const user = await User.findById(id);
          if (user.bannerUrl != "banner.png" && user.bannerUrl != "") {
            const filePath = path.resolve(
              "..",
              "static",
              "userbanners",
              user.bannerUrl,
            );
            fs.access(filePath, fs.constants.F_OK, async (err) => {
              if (err) {
                console.error("Файл не существует");
              } else {
                await ImageService.deleteFile(filePath);
              }
            });
          }
          user.bannerUrl = filename2;
          await user.save();
        }
      }
      if (avatarExists && bannerExists) {
        res.json(
          JSON.stringify({ avatarUrl: filename1, bannerUrl: filename2 }),
        );
      } else if (avatarExists && !bannerExists) {
        res.json(JSON.stringify({ avatarUrl: filename1, bannerUrl: "" }));
      } else if (bannerExists && !avatarExists) {
        res.json(JSON.stringify({ avatarUrl: "", bannerUrl: filename2 }));
      } else {
        res.json(JSON.stringify({ avatarUrl: "", bannerUrl: "" }));
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ e });
    }
  }
}

module.exports = new AuthService();
