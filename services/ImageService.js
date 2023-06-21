const path = require("path");
const fs = require("fs");
const ffmpeg = require("ffmpeg");

//Сервис для взаимодействия с файлами
class ImageService {
  //Генерация рандомного числа
  random() {
    return Math.round(Math.random() * 10000);
  }
  //Сохранение файла на диск
  saveFile(file, filename, folder) {
    //Построение пути, по которому будет перемещён файл
    try {
      const filePath = path.resolve("..", "static", folder, filename);
      file.mv(filePath);
      return filename;
    } catch (e) {
      console.log(e);
    }
  }
  saveBINFile(file, filename) {
    try {
      const filePath = path.resolve("..", "sample.bin.db1", filename);
      file.mv(filePath);
      return filename;
    } catch (e) {
      console.log(e);
    }
  }
  saveImageBase64(base64, name, folder) {
    try {
      const filepath = path.resolve("..", "static", folder, name);
      console.log(base64);
      const data = base64.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFile(filepath, data, { encoding: "base64" }, (err) => {
        console.log("success");
      });
    } catch (e) {
      console.log(e);
    }
  }
  saveVideoBase64(base64, name, folder) {
    try {
      const filepath = path.resolve("..", "static", folder, name);
      const data = base64.replace(/^data:video\/\w+;base64,/, "");
      fs.writeFile(filepath, data, { encoding: "base64" }, (err) => {
        console.log("success");
      });
    } catch (e) {
      console.log(e);
    }
  }
  saveAudioBase64(base64, name, folder) {
    try {
      const filepath = path.resolve("..", "static", folder, name);
      const data = base64.replace(/^data:audio\/\w+;base64,/, "");
      fs.writeFile(filepath, data, { encoding: "base64" }, (err) => {
        console.log("success");
      });
    } catch (e) {
      console.log(e);
    }
  }
  saveImageBase64(base64, name, folder) {
    try {
      const filepath = path.resolve("..", "static", folder, name);
      const data = base64.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFile(filepath, data, { encoding: "base64" }, (err) => {
        console.log("success");
      });
    } catch (e) {
      console.log(e);
    }
  }
  async deleteFile(filepath) {
    try {
      fs.unlink(filepath, (err) => {
        if (err) throw err;
        console.log("Файл удалён");
      });
    } catch (e) {
      console.log(e);
    }
  }
  async makeVideoScreenshot(videoName) {
    let proc = new ffmpeg(
      path.resolve("..", "static", "messagevideos", videoName)
    ).takeScreenshots(
      {
        count: 1,
        timemarks: ["600"], // number of seconds
      },
      path.resolve("..", "static", "message_video_screenshots"),
      function (err) {
        console.log("screenshots were saved");
      }
    );
    console.log(proc);
    //return proc
  }
}

module.exports = new ImageService();
