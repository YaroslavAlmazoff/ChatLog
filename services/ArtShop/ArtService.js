const MailService = require("../MailService");

class ArtService {
  async sendData(req, res) {
    MailService.sendArtMail(req.body);
  }
}

module.exports = new ArtService();
