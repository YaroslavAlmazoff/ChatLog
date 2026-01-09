const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    let token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const verified = jwt.verify(token, secret);
        if (!verified) {
          res.redirect("https://chatlog.ru/login");
          return;
        } else {
        }
        req.user = verified;
        next();
      } catch (e) {
        console.log(e);
        res.redirect("https://chatlog.ru/login");
      }
    } else {
      console.log("token not exists", token);
      res.json({ message: "else" });
    }
  } catch (e) {
    console.log(e);
    res.json("UNAUTHORIZED ERROR");
  }
};
