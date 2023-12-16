const ArtMailService = require("../ArtShop/ArtMailService");

class ArtService {
  async sendData(req, res) {
    ArtMailService.sendArtMail(req.body);
    res.json("Успешное оформление заказа!");
  }
}

module.exports = new ArtService();
