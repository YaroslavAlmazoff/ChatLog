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

module.exports = router;
