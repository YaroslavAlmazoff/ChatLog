const ArtMailService = require("../ArtShop/ArtMailService");

class ArtService {
  async sendData(req, res) {
    await ArtMailService.sendArtMail(req.body);
    res.json("Успешное оформление заказа!");
  }
}

module.exports = new ArtService();
