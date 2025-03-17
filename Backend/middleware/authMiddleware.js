const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token; // Get token from HTTP-only cookie

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Store decoded token payload in req.user
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
