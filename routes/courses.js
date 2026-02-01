const { Router } = require("express");
const CourseService = require("../services/CourseService");
const router = Router();

router.post("/edit", (req, res) => {
  try {
    CourseService.edit(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
