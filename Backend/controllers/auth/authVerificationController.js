const User = require("../../models/model/User");
const jwt = require("jsonwebtoken");
const { sendEmail, loadTemplate } = require("../email/sendEmail");
require("dotenv").config();
// 🔹 Verify Email
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check if verification code has expired
    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < Date.now()
    ) {
      const newVerificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      user.verificationCode = newVerificationCode;
      user.verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      user.isVerified = false;

      await user.save(); // Save updated code before sending email

      const emailContent = loadTemplate("verificationTemplate", {
        VERIFICATION_CODE: newVerificationCode,
      });

      await sendEmail(
        email,
        "Verify Your Email - bajarAnioDotCom",
        emailContent
      );

      return res.status(400).json({
        msg: "Verification code has expired. A new one has been sent to your email.",
      });
    }

    // Check if the code is invalid
    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    // Success - verification
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000 * 24 * 10, // 10 days
    });

    // Send confirmation email
    const confirmationContent = loadTemplate("confirmationTemplate", {
      USERNAME: user.username,
    });

    await sendEmail(
      email,
      "Your Account is Verified - BajarAnio.Com",
      confirmationContent
    );

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error("Error during email verification:", err);
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
