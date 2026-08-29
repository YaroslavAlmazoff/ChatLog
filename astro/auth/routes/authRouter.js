const express = require("express");
const {
  login,
  verify,
  refresh,
  update,
} = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Weak password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      await login(req, res);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  },
);
router.post("/verify", async (req, res) => {
  try {
    await verify(req, res);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

router.post("/update-settings", auth, async (req, res) => {
  try {
    await update(req, res);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    await refresh(req, res);
  } catch (e) {
    console.log(e);
    res
      .status(403)
      .json({ refreshToken: "", message: "Invalid or expired refresh token" });
  }
});

module.exports = router;
