const UserFoto = require("../models/UserFoto");
const FileService = require("./FileService");
const uuid = require("uuid");
const path = require("path");
const ImageService = require("./ImageService");

//Сервис фотографий пользователя
class FotoService {
  //Новая фотография пользователя
  async create(req, res) {
    const { date } = req.body;
    const filename = uuid.v4() + ".jpg";

    await FileService.insertUserFoto(req.files.file, filename);
    const user = req.user.userId;
    const photo = await UserFoto.create({
      date,
      likes: 0,
      comments: 0,
      imageUrl: filename,
      user,
    });
    res.json({ photo });
  }
  //Возвращение фотографий пользователя
  async receive(req, res) {
    //Получение ID пользователя
    const user = req.params.id;
    //Поиск фотографий
    const fotos = await UserFoto.find({ user });
    //Возвращение фотографий на клиент
    res.json({ fotos });
  }
  //Удаление фотографии
  async delete(req, res) {
    //Получение ID пользователя
    const url = req.params.url;
    const foto = await UserFoto.findOne({ imageUrl: url });
    const image = foto.imageUrl;
    const filepath = path.resolve("..", "static", "userfotos", image);
    ImageService.deleteFile(filepath);
    //Поиск фотографии и её удаление
    await UserFoto.deleteOne({ imageUrl: url });
    res.json({ message: "Фотография удалена." });
  }
  async receiveByUrl(req, res) {
    const imageUrl = req.params.url;
    const foto = await UserFoto.findOne({ imageUrl });
    res.json({ foto });
  }
}

module.exports = new FotoService();
