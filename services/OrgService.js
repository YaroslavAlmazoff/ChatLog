const fs = require("fs");
const path = require("path");

class OrgService {
  async edit(req, res) {
    try {
      fs.writeFile(
        path.resolve("..", "static", "org", "data.json"),
        json.stringify(req.body.data),
        "utf8",
        (e) => {
          if (e) console.log(e);
          console.log("Файл обновлён");
        }
      );

      res.json(data);
    } catch (err) {
      console.error("Ошибка:", err);
      res.json();
    }
  }
}

module.exports = new OrgService();
