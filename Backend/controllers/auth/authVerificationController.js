const User = require("../../models/model/User");
const jwt = require("jsonwebtoken");
const { sendEmail, loadTemplate } = require("../email/sendEmail");
require("dotenv").config();
// 🔹 Verify Email
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }
    // Check for expiration
    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < Date.now()
    ) {
      user.verificationCode = null;
      await user.save(); // Clean up expired code
      return res.status(400).json({ msg: "Verification code has expired" });
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null; // Clean up the expiration date.
    await user.save();
    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "10d" } // Token expiration
    );
    // Send the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Lax",
      maxAge: 3600000 * 24 * 10, // 10 days
    });

    // Load & send confirmation email
    const emailContent = loadTemplate("confirmationTemplate", {
      USERNAME: user.username,
    });
    await sendEmail(
      email,
      "Your Account is Verified - Jotter Storage",
      emailContent
    );

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    // console.error("Error during email verification:", err);
    res.status(500).json({ msg: "Server error during email verification" });
  }
};
// 🔹 Verify OTP for Password Reset
exports.verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ msg: "User not found" });

  if (user.verificationCode !== otp)
    return res.status(400).json({ msg: "Invalid OTP" });

  if (new Date() > user.verificationCodeExpires)
    return res.status(400).json({ msg: "OTP expired" });

  user.isOtpVerified = true;
  await user.save();
  res.status(200).json({ msg: "OTP verified. Proceed to reset password." });
};
