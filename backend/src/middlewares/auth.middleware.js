const jwt = require("jsonwebtoken");
const env = require("../config/env");

/**
 * JWT Authentication Middleware
 * Header format:
 * Authorization: Bearer <token>
 */
module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader && env.ALLOW_DEV_AUTH_BYPASS === "true") {
      req.user = { userId: "dev-user", role: "developer" };
      return next();
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded; // { id, email, role }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
