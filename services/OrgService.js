const fs = require("fs");
const path = require("path");

class OrgService {
  async edit(req, res) {
    try {
      await fs.writeFile(
        path.resolve("..", "static", "org", "data.json"),
        req.body.data,
        "utf8"
      );

      console.log("Файл обновлён");
      res.json(data);
    } catch (err) {
      console.error("Ошибка:", err);
      res.json();
    }
  }
}

module.exports = new OrgService();
