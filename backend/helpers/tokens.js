const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {

  let payload = {
    id: user.id,
  };

  return jwt.sign(payload, SECRET_KEY);
}

function getToken(req) {

  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const user = jwt.verify(token, SECRET_KEY);
      return user.id;
    }
  } catch (err) {
  }
}

module.exports = { createToken, getToken };