const fs = require("fs");
const path = require("path");

class CourseService {
  async edit(req, res) {
    try {
      fs.writeFile(
        path.resolve("..", "static", "courses", "android.json"),
        JSON.stringify(req.body),
        "utf8",
        (e) => {
          if (e) console.log(e);
          console.log("Файл обновлён");
        },
      );

      res.json(req.body);
    } catch (err) {
      console.error("Ошибка:", err);
      res.json();
    }
  }
}

module.exports = new CourseService();
