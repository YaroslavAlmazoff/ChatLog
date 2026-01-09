const jwt = require("jsonwebtoken");
const { secret, refreshSecret } = require("../config");

class TokenService {
  generateTokens(payload) {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: "30d",
    });
    return {
      token,
      refreshToken,
    };
  }
}

module.exports = new TokenService();
