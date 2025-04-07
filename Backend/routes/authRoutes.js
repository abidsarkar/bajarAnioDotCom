const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const authLimiter = rateLimit({
  windowMs: `${process.env.AuthRateLimit}`, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many attempts, please try again later",
});
const { register } = require("../controllers/auth/authRegisterController");
const {
  login,
  requestPasswordReset,
  resetPassword,
  changePassword,
  logout,
} = require("../controllers/auth/authRestAndChangeController");
const {
  verifyEmail,
  verifyResetOTP,
} = require("../controllers/auth/authVerificationController");
const {
  googleLogin,
  googleCallback,
} = require("../controllers/auth/googleAuthControllers");
const authMiddleware = require("../controllers/middleware/authMiddleware");
//register a new user
router.post("/register", authLimiter, register);
router.post("/verify-email", authLimiter, verifyEmail);
//login a user
router.post("/login", login);
//request password reset for forgot password
router.post("/request-password-reset", authLimiter, requestPasswordReset);
//verify otp when user forget password
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
//change password when user is logged in
router.post("/change-password", authMiddleware, changePassword);

//google login
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
//logout a user
router.get("/logout", logout);
module.exports = router;
