const jwt = require("jsonwebtoken");
const config = require("../config");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, config.refreshSecret, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new TokenService();
