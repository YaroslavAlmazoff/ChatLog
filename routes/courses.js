const { Router } = require("express");
const CourseService = require("../services/CourseService");
const router = Router();

router.post("/edit", (req, res) => {
  CourseService.edit(req, res);
});

router.post("/upload-videos", (req, res) => {
  CourseService.uploadVideos(req, res);
});

module.exports = router;
