const { Router } = require("express");
const CourseService = require("../services/CourseService");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/edit", auth, (req, res) => {
  CourseService.edit(req, res);
});

router.post("/upload-videos", auth, (req, res) => {
  CourseService.uploadVideos(req, res);
});

router.get("/backups", (req, res) => {
  CourseService.getBackups(req, res);
});

router.post("/restore", auth, (req, res) => {
  CourseService.restoreBackup(req, res);
});
router.post("/save", async (req, res) => {
  CourseService.saveProgress(req, res);
});

module.exports = router;
