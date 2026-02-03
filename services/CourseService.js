const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");

class CourseService {
  async edit(req, res) {
    try {
      const course = req.body;

      const coursePath = path.resolve(
        "..",
        "static",
        "courses",
        "android.json",
      );
      const videosDir = path.resolve("..", "static", "courses", "videos");

      /* ---------- 1. Собираем все video.id из структуры ---------- */

      const videoIds = new Set();

      course.parts?.forEach((part) => {
        part.blocks?.forEach((block) => {
          block.lessons?.forEach((lesson) => {
            if (lesson.video?.id) {
              videoIds.add(lesson.video.id);
            }
          });
        });
      });

      /* ---------- 2. Читаем папку с видео ---------- */

      fs.readdir(videosDir, (err, files) => {
        if (err) {
          console.error("Ошибка чтения папки videos:", err);
          return;
        }

        files.forEach((file) => {
          if (!file.endsWith(".mp4")) return;

          const id = file.replace(".mp4", "");

          if (!videoIds.has(id)) {
            const filePath = path.join(videosDir, file);

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Ошибка удаления видео:", file, err);
              } else {
                console.log("Удалено лишнее видео:", file);
              }
            });
          }
        });
      });

      /* ---------- 3. Сохраняем структуру курса ---------- */

      fs.writeFile(coursePath, JSON.stringify(course, null, 2), "utf8", (e) => {
        if (e) {
          console.error("Ошибка записи курса:", e);
        } else {
          console.log("Файл курса обновлён");
        }
      });

      res.json(course);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Ошибка сохранения курса" });
    }
  }

  async uploadVideos(req, res) {
    try {
      if (!req.files) {
        return res.status(400).json({ message: "Файлы не переданы" });
      }

      const uploadDir = path.resolve("..", "static", "courses", "videos");

      // гарантируем, что папка существует
      await fsPromises.mkdir(uploadDir, { recursive: true });

      const files = Object.values(req.files);

      for (const file of files) {
        const filePath = path.join(uploadDir, file.name);
        await file.mv(filePath);
      }

      return res.json({ message: "Видео успешно загружены" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new CourseService();
