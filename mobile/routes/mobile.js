const { Router } = require("express");
const MobileService = require("../../services/Mobile/MobileService");
const router = Router();

router.get("/get-weather/:city", (req, res) => {
  try {
    MobileService.getWeather(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/get-forecast", (req, res) => {
  try {
    MobileService.getForecast(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/translit/:word", (req, res) => {
  try {
    MobileService.translit(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
