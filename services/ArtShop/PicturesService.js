const Picture = require("../../models/Picture");
const FileService = require("../FileService");

class PicturesService {
  async pictures(req, res) {
    res.json({ pictures: await Picture.find({}) });
  }
  async create(req, res) {
    const { title, description, technic, size, price } = req.body;
    const imageUrl = require("uuid").v4() + ".jpg";
    await FileService.insertPicture(req.files.file, imageUrl);
    await Picture.create({
      title,
      description,
      technic,
      size,
      price,
      imageUrl,
    });
    res.json({});
  }
  async picture(req, res) {
    res.json({ picture: await Picture.findById(req.params.id) });
  }
}

module.exports = new PicturesService();
