const jwt = require("jsonwebtoken");
const { secret, refreshSecret } = require("../config");
const Token = require("../models/Token");
const TokenService = require("../services/TokenService");

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

//   const { refreshToken } = req.cookies;
//   if (refreshToken) {
//     const tokenData = await Token.findOne({ refreshToken });
//     const validated = jwt.verify(refreshToken, refreshSecret);
//     const verified = tokenData || validated;
//     if (!verified) {
//       res.status(401).json({ msg: "Not authorized" });
//       return;
//     }
//     req.user = validated;
//     next();
//   } else if (token) {
//     try {
//       const accessVerified = jwt.verify(token, secret);
//       if (!accessVerified) {
//         res.status(401).json({ msg: "Not authorized" });
//         return;
//       }
//       req.user = accessVerified;
//       next();
//     } catch (e) {
//       res.json({ verified: false });
//     }
//   } else {
//     res.status(401).json({ msg: "Not authorized" });
//   }
// } catch (e) {
//   res.status(401).json({ msg: "Not authorized" });
//   console.log(e);
