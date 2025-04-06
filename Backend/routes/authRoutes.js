const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many attempts, please try again later"
});
const { register } = require("../controllers/auth/authRegisterController");
const {
  login,
  requestPasswordReset,
  resetPassword,
  changePassword,
} = require("../controllers/auth/authRestAndChangeController");
const {
  verifyEmail,
  verifyResetOTP,
} = require("../controllers/auth/authVerificationController");
const {
  googleLogin,
  googleCallback,
} = require("../controllers/auth/googleAuthControllers");
const authMiddleware = require("../controllers/middleware/authMiddleware")
//register a new user
router.post("/register",authLimiter,register)
//login a user
router.post("/login",login)
router.post("/request-password-reset",authLimiter, requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.post("/verify-email",authLimiter, verifyEmail);
router.post("/verify-reset-otp", verifyResetOTP);
//google login
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
module.exports = router;
