const fs = require("fs");
const path = require("path");

class OrgService {
  async edit(req, res) {
    try {
      console.log(req.body);
      fs.writeFile(
        path.resolve("..", "static", "org", "data.json"),
        JSON.stringify(req.body),
        "utf8",
        (e) => {
          if (e) console.log(e);
          console.log("Файл обновлён");
        }
      );

      res.json(req.body);
    } catch (err) {
      console.error("Ошибка:", err);
      res.json();
    }
  }
}

module.exports = new OrgService();
