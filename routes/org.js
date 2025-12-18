const { Router } = require("express");
const OrgService = require("../services/OrgService");
const router = Router();

router.post("/edit", (req, res) => {
  try {
    OrgService.edit(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit-map", (req, res) => {
  try {
    OrgService.editMap(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit-sources", (req, res) => {
  try {
    OrgService.editSources(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
