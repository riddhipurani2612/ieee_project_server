const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({ msg: "No Token Found" });
  }
  try {
    const decoded = jwt.verify(token, config.get("secretKey"));
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Authentication Error" });
  }
};
