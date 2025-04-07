const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Get token from cookie or Authorization header
  let token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "Access Denied. No token provided." });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ msg: "Server configuration error" });
  }

  try {
    // Verify token (this checks signature and expiration automatically)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // console.error("Token verification failed:", err);

    // Different error messages based on error type
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Invalid token." });
    } else {
      return res.status(401).json({ msg: "Authentication failed." });
    }
  }
};

module.exports = authMiddleware;