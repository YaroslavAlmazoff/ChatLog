const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");

class CourseService {
  async ensureDir(dirPath) {
    await fsPromises.mkdir(dirPath, { recursive: true });
  }
  isValidCourse(course) {
    if (!course || typeof course !== "object") return false;
    if (!Array.isArray(course.parts)) return false;

    for (const part of course.parts) {
      if (!Array.isArray(part.blocks)) return false;

      for (const block of part.blocks) {
        if (!Array.isArray(block.lessons)) return false;
      }
    }

    return true;
  }
  async createBackup(coursePath) {
    const backupsDir = path.resolve("..", "static", "courses", "backups");

    await ensureDir(backupsDir);

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/:/g, "-")
      .replace("T", "_")
      .slice(0, 19);

    const backupName = `android_${timestamp}.json`;
    const backupPath = path.join(backupsDir, backupName);

    const currentContent = await fsPromises.readFile(coursePath, "utf8");

    await fsPromises.writeFile(backupPath, currentContent, "utf8");
  }
  async cleanupBackups() {
    const backupsDir = path.resolve("..", "static", "courses", "backups");
    const files = await fsPromises.readdir(backupsDir);

    const backups = files.filter((f) => f.endsWith(".json")).sort(); // по имени = по дате

    const MAX = 50;

    if (backups.length <= MAX) return;

    const toDelete = backups.slice(0, backups.length - MAX);

    for (const file of toDelete) {
      await fsPromises.unlink(path.join(backupsDir, file));
    }
  }
  async edit(req, res) {
    try {
      if (req.user.userId != "628e5aab0153706a3e18fe79")
        return res.status(400).json({ message: "Вы не имеете на это права." });
      const course = req.body;

      if (!isValidCourse(course)) {
        return res.status(400).json({
          message: "Структура курса повреждена",
        });
      }

      const coursePath = path.resolve(
        "..",
        "static",
        "courses",
        "android.json",
      );
      await createBackup(coursePath);
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
      if (req.user.userId != "628e5aab0153706a3e18fe79")
        return res.status(400).json({ message: "Вы не имеете на это права." });

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
  async getBackups(req, res) {
    const backupsDir = path.resolve("..", "static", "courses", "backups");
    await ensureDir(backupsDir);
    const files = await fsPromises.readdir(backupsDir);

    const backups = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .map((file) => {
        const match = file.match(/android_(.+)\.json/);
        return {
          file,
          createdAt: match?.[1]?.replace("_", " "),
        };
      });

    res.json(backups);
  }
  async restoreBackup(req, res) {
    const { file } = req.body;
    if (req.user.userId != "628e5aab0153706a3e18fe79")
      return res.status(400).json({ message: "Вы не имеете на это права." });

    if (!file) {
      return res.status(400).json({ message: "Файл не указан" });
    }

    const backupsDir = path.resolve("..", "static", "courses", "backups");
    const backupPath = path.join(backupsDir, file);

    const coursePath = path.resolve("..", "static", "courses", "android.json");

    const content = await fsPromises.readFile(backupPath, "utf8");

    // 🔒 делаем бэкап текущего состояния перед восстановлением
    await createBackup(coursePath);

    await fsPromises.writeFile(coursePath, content, "utf8");

    res.json({ message: "Курс восстановлен" });
  }
}

module.exports = new CourseService();
