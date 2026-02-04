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

module.exports = router;
