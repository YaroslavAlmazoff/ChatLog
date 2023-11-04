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

  //Регистрация пользователя
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ errors }).status(400);
      }
      const userData = req.body;
      const { name, surname, age, email, country, city, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        res
          .status(400)
          .json({ error: "Пользователь с таким email уже зарегистрирован" });
        return;
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
      });

      const { token, refreshToken } = TokenService.generateTokens({
        userId: user._id,
      });

      const tokenData = await Token.findOne({ user: user._id });
      if (tokenData) {
        tokenData.token = refreshToken;
        await tokenData.save();
      }

      await MailService.sendActivationLink(
        email,
        "https://chatlog.ru/api/activate/" + user._id
      );

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
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ e });
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
        { name, surname, age, email, aboutMe, city, country }
      );
      //Загрузка или обновление изображений аватарки и баннера
      if (req.files) {
        if (req.files.file) {
          //Генерирование нового имени для файла аватарки
          //Загрузка аватарки на сервер
          await FileService.insertUserAvatar(req.files.file, id, filename1);
          //Обновление аватарки
          await User.findByIdAndUpdate({ _id: id }, { avatarUrl: filename1 });
        }
        if (req.files.file2) {
          //Генерирование нового имени для файла баннера
          //Загрузка баннера на сервер
          await FileService.insertUserBanner(req.files.file2, id, filename2);
          //Обновление баннера
          await User.findByIdAndUpdate({ _id: id }, { bannerUrl: filename2 });
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
          JSON.stringify({ avatarUrl: filename1, bannerUrl: filename2 })
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
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
      });
      res.json({ user, token, userId: user._id, errors: [] });
    } catch (e) {
      console.log(e);
      res.status(400).json({ e });
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

      res.json({ token, refreshToken, userId: user._id, user, errors: [] });
    } catch (e) {
      console.log(e);
      res.status(400).json({ e });
    }
  }
  async activate(req, res) {
    const user = await User.findById(req.params.link);
    user.isActivated = true;
    user.save();
    res.json({ message: "success acivation" });
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
      "https://chatlog.ru/return-password/" + user._id + "/" + link
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
      const avatarExists = Boolean(req.body.avatarExists);
      const bannerExists = Boolean(req.body.bannerExists);
      console.log(avatarExists, bannerExists);
      //Загрузка или обновление изображений аватарки и баннера
      if (req.files) {
        console.log(req.files);
        // console.log(req.files.avatar);
        // console.log(req.files.banner);
        if (avatarExists) {
          console.log("create avatar");
          await FileService.insertUserAvatar(req.files.avatar, id, filename1);
          await User.findByIdAndUpdate(id, { avatarUrl: filename1 });
        } else if (bannerExists) {
          console.log("create banner");
          await FileService.insertUserBanner(req.files.banner, id, filename2);
          await User.findByIdAndUpdate(id, { bannerUrl: filename2 });
        }
      }
      if (avatarExists && bannerExists) {
        res.json(
          JSON.stringify({ avatarUrl: filename1, bannerUrl: filename2 })
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
