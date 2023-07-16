const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const textract = require("textract");
const NotificationService = require("./NotificationService");
const User = require("../models/User");
const Notification = require("../models/Notification");

//Сервис облачного хранилища
class CloudService {
  translit(word) {
    var answer = "";
    var converter = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "e",
      ж: "zh",
      з: "z",
      и: "i",
      й: "y",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "h",
      ц: "c",
      ч: "ch",
      ш: "sh",
      щ: "sch",
      ь: "",
      ы: "y",
      ъ: "",
      э: "e",
      ю: "yu",
      я: "ya",

      А: "A",
      Б: "B",
      В: "V",
      Г: "G",
      Д: "D",
      Е: "E",
      Ё: "E",
      Ж: "Zh",
      З: "Z",
      И: "I",
      Й: "Y",
      К: "K",
      Л: "L",
      М: "M",
      Н: "N",
      О: "O",
      П: "P",
      Р: "R",
      С: "S",
      Т: "T",
      У: "U",
      Ф: "F",
      Х: "H",
      Ц: "C",
      Ч: "Ch",
      Ш: "Sh",
      Щ: "Sch",
      Ь: "",
      Ы: "Y",
      Ъ: "",
      Э: "E",
      Ю: "Yu",
      Я: "Ya",
    };

    for (var i = 0; i < word.length; ++i) {
      if (converter[word[i]] == undefined) {
        answer += word[i];
      } else {
        answer += converter[word[i]];
      }
    }

    return answer;
  }
  basePath = `/home/yaroslav2/static/userfiles/`;
  walk(dir, done, valid = true) {
    var results = [];
    fs.readdir(dir, (err, list) => {
      if (err && valid) return done(err);
      var pending = list.length;
      if (!pending && valid) return done(null, results);
      list.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => {
          if (stat && stat.isDirectory()) {
            results = results.concat([file]);
            this.walk(file, (err, res) => {
              results = results.concat(res);
              if (!--pending && valid) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending && valid) done(null, results);
          }
        });
      });
    });
  }
  removeSpaces(str) {
    return str.replace(/\s/g, "");
  }

  // async upload(req, res) {
  //   const userid = req.user.userId;
  //   const file = req.files.file;
  //   console.log(file);
  //   file.name = this.removeSpaces(req.body.name);
  //   const folder = JSON.parse(req.body.folder);
  //   if (folder.id) {
  //     const parent = await File.findById(folder.id);
  //     let ext = file.name.split(".");
  //     ext = ext[ext.length - 1];
  //     if (parent.path) {
  //       await File.create({
  //         name: file.name,
  //         path: `${parent.path}/${file.name}`,
  //         ext,
  //         type: file.mimetype,
  //         size: file.size,
  //         owner: userid,
  //         public: false,
  //         folder: folder.id,
  //       });
  //       file.mv(`${parent.path}/${file.name}`);
  //     } else {
  //       await File.create({
  //         name: file.name,
  //         path: this.basePath + `${userid}/${parent.name}/${file.name}`,
  //         ext,
  //         type: file.mimetype,
  //         size: file.size,
  //         owner: userid,
  //         public: false,
  //         folder: folder.id,
  //       });
  //       file.mv(this.basePath + `${userid}/${parent.name}/${file.name}`);
  //     }
  //     await this.getFilesInner(res, userid, folder.id);
  //   } else {
  //     const filepath = `${this.basePath}${userid}/${file.name}`;
  //     let ext = file.name.split(".");
  //     ext = ext[ext.length - 1];
  //     console.log(ext, file.name);
  //     await File.create({
  //       name: file.name,
  //       path: filepath,
  //       ext,
  //       type: file.mimetype,
  //       size: file.size,
  //       owner: userid,
  //       public: false,
  //     });
  //     file.mv(filepath);
  //     await this.getFilesInner(res, userid);
  //   }
  // }

  removeBackslash(str) {
    return str.replace(/\\/g, "");
  }

  async uploadMobile(req, res) {
    const userid = req.user.userId;
    let names;
    console.log(req.files);
    let folder;
    if (req.body.mobile) {
      folder = this.removeBackslash(req.body.folder);
    } else {
      folder = JSON.parse(req.body.folder);
      names = JSON.parse(req.body.names);
      console.log(names);
    }
    console.log(folder);

    const fns = Object.keys(req.files).map(async (filename, i) => {
      let file = req.files[filename];
      let name = file.name;
      if (!req.body.mobile) {
        name = names[i];
      }
      if (folder.id) {
        const parent = await File.findById(folder.id);
        let ext = name.split(".");
        ext = ext[ext.length - 1];
        if (parent.path) {
          await File.create({
            name: name,
            path: `${parent.path}/${name}`,
            ext,
            type: file.mimetype,
            size: file.size,
            owner: userid,
            public: false,
            folder: folder.id,
          });
          file.mv(`${parent.path}/${name}`);
        } else {
          await File.create({
            name: name,
            path: this.basePath + `${userid}/${parent.name}/${name}`,
            ext,
            type: file.mimetype,
            size: file.size,
            owner: userid,
            public: false,
            folder: folder.id,
          });
          file.mv(this.basePath + `${userid}/${parent.name}/${name}`);
        }
      } else {
        console.log("here");
        const filepath = `${this.basePath}${userid}/${name}`;
        let ext = name.split(".");
        ext = ext[ext.length - 1];
        console.log(ext, name);
        await File.create({
          name: name,
          path: filepath,
          ext,
          type: file.mimetype,
          size: file.size,
          owner: userid,
          public: false,
        });
        file.mv(filepath);
      }
      return filename;
    });
    Promise.all(fns)
      .then(async () => {
        if (folder.id) {
          await this.getFilesInner(res, userid, folder.id, req.body.mobile);
        } else {
          await this.getFilesInner(res, userid, null, req.body.mobile);
        }
      })
      .catch((e) => {
        console.log(e);
        res.json({ files: [], e: e.message });
      });
  }

  async getFilesInner(res, owner, folder, mobile) {
    if (folder) {
      const files = await File.find({ owner, folder });
      if (mobile) {
        res.json(JSON.stringify({ files }));
      } else {
        res.json({ files });
      }
    } else {
      const files = await File.find({ owner, folder: "" });
      if (mobile) {
        res.json(JSON.stringify({ files }));
      } else {
        res.json({ files });
      }
    }
  }

  async getFiles(req, res) {
    const owner = req.user.userId;
    console.log(req.body);
    let folder;
    if (req.body.mobile) {
      folder = req.body.folder;
    } else {
      folder = JSON.parse(req.body.folder);
    }
    console.log(folder);
    if (folder.name == "root") {
      const files = await File.find({ owner, folder: "" });
      res.json({ files });
    } else {
      const files = await File.find({ owner, folder: folder.id });
      res.json({ files });
    }
  }
  async getRootFile(req, res) {
    const files = await File.find({ owner: req.user.userId, folder: "" });
    res.json({ files });
  }
  async getFilesByFolderName(req, res) {
    console.log(req.body.name);
    if (req.body.name != "root") {
      const folder = await File.findOne({
        owner: req.user.userId,
        name: req.body.name,
      });
      const files = await File.find({ folder: folder._id });
      res.json({ files });
    } else {
      const files = await File.find({ owner: req.user.userId, folder: "" });
      res.json({ files });
    }
  }
  async getFilesByFolderNameMobile(req, res) {
    const name = JSON.parse(req.body).name;
    if (name != "root") {
      const folder = await File.findOne({
        owner: req.user.userId,
        name,
      });
      const files = await File.find({ folder: folder._id });
      res.json({ files });
    } else {
      const files = await File.find({ owner: req.user.userId, folder: "" });
      res.json({ files });
    }
  }
  async deleteFile(req, res) {
    const owner = req.user.userId;
    const id = req.params.id;
    const file = await File.findById(id);
    await File.deleteOne({ owner, name: file.name });
    fs.unlink(file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });
    await this.getFilesInner(res, owner);
  }
  async fileText(req, res) {
    const id = req.params.id;
    const file = await File.findById(id);
    fs.readFile(file.path, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ data });
      }
    });
  }
  async hardFileText(req, res) {
    const id = req.params.id;
    const file = await File.findById(id);
    textract.fromFileWithPath(file.path, (err, text) => {
      if (err) {
        console.log(err);
      } else {
        console.log(text);
        res.json({ text });
      }
    });
  }
  async fileById(req, res) {
    const id = req.params.id;
    const file = await File.findById(id);
    res.json({ file });
  }
  async publicFile(req, res) {
    const id = req.params.id;
    await File.findByIdAndUpdate(id, { public: true });
    res.json({ msg: "да." });
  }
  async sendFile(req, res) {
    const user1 = req.user.userId;
    const user2 = req.params.user;
    const fullUser1 = await User.findById(user1);
    const name = fullUser1.name;
    const surname = fullUser1.surname;
    await NotificationService.create(
      user1,
      user2,
      `${name} ${surname} хочет отправить вам файл ${req.params.filename} Получить файл?`,
      "file",
      "cloud",
      req.params.id
    );
    res.json({ msg: "да." });
  }
  async getSentFile(req, res) {
    const id = req.params.id;
    const notification = await Notification.findById(id);
    const user2 = notification.to;
    const fileId = notification.postID;
    const file = await File.findById(fileId);
    const from = file.path;
    const to = this.basePath + `${user2}/${file.name}`;
    console.log(id, notification, user2, fileId, file, from, to);
    fs.copyFile(from, to, (err) => {
      if (err) console.log(err);
      console.log("copyed.");
    });
    await File.create({
      name: file.name,
      ext: file.ext,
      type: file.type,
      size: file.size,
      owner: user2,
      public: false,
      path: to,
    });
    res.json({ msg: "да." });
  }
  getFileToDownload(req, res) {
    const owner = req.user.userId;
    const name = req.params.id;
    fs.readFile(
      path.resolve("..", "static", "userfiles", owner, name),
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const base64Data = data.toString("base64");
          res.json({ file: base64Data });
        }
      }
    );
  }
  async makeFolder(req, res) {
    const id = req.user.userId;
    const { folder, folderId, name } = req.body;
    console.log(id, folderId, folder, name);
    this.walk(path.resolve("..", "static", "userfiles", id), (err, results) => {
      if (err) throw err;
      if (!results.length) {
        fs.mkdir(
          path.resolve("..", "static", "userfiles", id, name),
          async (err) => {
            console.log(err);
            if (err) return;
            await File.create({
              name,
              ext: "",
              type: "folder",
              size: 0,
              owner: id,
              public: false,
              folder: "",
            });
            console.log("success");
            await this.getFilesInner(res, id);
          }
        );
      }
      results.forEach((item) => {
        const itemName = item.split("/")[item.split("/").length - 1];
        if (itemName == folder) {
          fs.mkdir(`${item}/${name}`, async (err) => {
            console.log(err);
            if (err) return;
            await File.create({
              name,
              path: `${item}/${name}`,
              ext: "",
              type: "folder",
              size: 0,
              owner: id,
              public: false,
              folder: folderId,
            });
            console.log("success");
            await this.getFilesInner(res, id, folderId);
          });
        } else if (folder == "root") {
          fs.mkdir(
            path.resolve("..", "static", "userfiles", id, name),
            async (err) => {
              console.log(err);
              if (err) return;
              await File.create({
                name,
                ext: "",
                type: "folder",
                size: 0,
                owner: id,
                public: false,
                folder: "",
              });
              console.log("success");
              await this.getFilesInner(res, id);
            }
          );
        }
      });
      //console.log(results)
    });
  }

  async makeFolderMobile(req, res) {
    const id = req.user.userId;
    const { folder, folderId, name } = req.body;
    console.log(id, folderId, folder, name);
    this.walk(path.resolve("..", "static", "userfiles", id), (err, results) => {
      if (err) throw err;
      if (!results.length) {
        fs.mkdir(
          path.resolve("..", "static", "userfiles", id, name),
          async (err) => {
            console.log(err);
            if (err) return;
            const file = await File.create({
              name,
              ext: "",
              type: "folder",
              size: 0,
              owner: id,
              public: false,
              folder: "",
            });
            console.log("success");
            res.json({ file });
          }
        );
      }
      results.forEach((item) => {
        const itemName = item.split("/")[item.split("/").length - 1];
        if (itemName == folder) {
          fs.mkdir(`${item}/${name}`, async (err) => {
            console.log(err);
            if (err) return;
            const file = await File.create({
              name,
              path: `${item}/${name}`,
              ext: "",
              type: "folder",
              size: 0,
              owner: id,
              public: false,
              folder: folderId,
            });
            console.log("success");
            res.json({ file });
          });
        } else if (folder == "root") {
          fs.mkdir(
            path.resolve("..", "static", "userfiles", id, name),
            async (err) => {
              console.log(err);
              if (err) return;
              const file = await File.create({
                name,
                ext: "",
                type: "folder",
                size: 0,
                owner: id,
                public: false,
                folder: "",
              });
              console.log("success");
              res.json({ file });
            }
          );
        }
      });
      //console.log(results)
    });
  }

  async removeFolder(req, res) {
    const id = req.user.userId;
    const folder = await File.findById(req.params.id);
    if (req.user.userId == folder.owner) {
      this.walk(
        path.resolve("..", "static", "userfiles", id),
        (err, results) => {
          if (err) throw err;
          results.forEach((item) => {
            const itemName = item.split("/")[item.split("/").length - 1];
            if (itemName == folder.name) {
              fs.rmdir(item, function (err) {
                throw err;
              });
            } else if (folder == "root") {
              fs.rmdir(
                path.resolve("..", "static", "userfiles", id, folder.name),
                function (err) {
                  throw err;
                }
              );
            }
          });
          //console.log(results)
        }
      );
      await File.findByIdAndDelete(req.params.id);
      res.json({ message: "Удалено" });
    } else {
      res.json({ message: "Недостаточно прав" });
    }
  }
  async checkFolder(req, res) {
    const { name } = req.body;
    const id = req.user.userId;
    if (!name) {
      res.json({ valid: false, error: "Имя папки не может быть пустым" });
      res.end();
      return;
    } else if (
      name.includes("~") ||
      name.includes("`") ||
      name.includes("!") ||
      name.includes("#") ||
      name.includes('"') ||
      name.includes("@") ||
      name.includes("$") ||
      name.includes("%") ||
      name.includes(",") ||
      name.includes("^") ||
      name.includes("&") ||
      name.includes("?") ||
      name.includes("*") ||
      name.includes("+") ||
      name.includes("=") ||
      name.includes("/") ||
      name.includes(":") ||
      name.includes(";")
    ) {
      res.json({ valid: false, error: "Недопустимые симоволы в имени папки" });
      res.end();
      return;
    }
    const dir = await File.findOne({ name, owner: id, type: "folder" });
    if (dir) {
      res.json({
        valid: false,
        error: "Такая папка уже есть в вашем хранилище",
      });
    } else {
      res.json({ valid: true });
    }
  }
  async getPath(req, res) {
    if (req.params.id) {
      const folder = await File.findById(req.params.id);
      if (!folder.path) {
        console.log(folder.name);
        res.json({ path: [folder.name] });
        return;
      }
      const path = folder.path.split("/").slice(6);
      res.json({ path });
    } else {
      res.json({ path: [] });
    }
  }
}

module.exports = new CloudService();
