const jwt = require("jsonwebtoken");

const notVerified = { verified: false, isSuccessful: false };

module.exports = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
          res.json(notVerified);
          return;
        }
        req.user = verified;
        next();
      } catch (e) {
        console.log(e);
        res.json(notVerified);
      }
    } else {
      res.json(notVerified);
    }
  } catch (e) {
    console.log(e);
    res.json(notVerified);
  }
};
