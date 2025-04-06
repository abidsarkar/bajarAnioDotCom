const User = require("../../models/model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail, loadTemplate } = require("../email/sendEmail");
require("dotenv").config();

// 🔹 Register User
exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Passwords do not match" });
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email is already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const delayMilliseconds = 15 * 60 * 1000; // 15 minutes in milliseconds
    const futureTimestamp = Date.now() + delayMilliseconds;
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: futureTimestamp,
    });

    await newUser.save();

    // Load & send verification email
    const emailContent = loadTemplate("verificationTemplate", {
      VERIFICATION_CODE: verificationCode,
    });
    await sendEmail(email, "Verify Your Email - bajarAnioDotCom", emailContent);

    res.status(201).json({ msg: "User registered, verify your email" });
  } catch (error) {
    res.status(500).json({ msg: "Server error, please try again" });
  }
};
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

// 🔹 Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ msg: "Invalid email or password" });

  if (!user.isVerified)
    return res.status(403).json({ msg: "Verify your email before logging in" });

  // 3. Generate a JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "30d" } // Token expiration
  );

  // 4. Send the token to the client
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ token, msg: "Login successful" });
};

// 🔹 Request Password Reset (Send OTP)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  // Validate email
  if (!email || typeof email !== "string") {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const trimmedEmail = email.trim(); // Trim the email
  const user = await User.findOne({ email: trimmedEmail });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  // Generate a 6-digit OTP
  const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = resetOTP;
  const delayMilliseconds = 15 * 60 * 1000; // 15 minutes in milliseconds
  const futureTimestamp = Date.now() + delayMilliseconds;
  user.verificationCodeExpires = futureTimestamp; // Expires in 15 minutes
  user.isOtpVerified=false;
  await user.save();

  // Load & send OTP email
  const emailContent = loadTemplate("resetPasswordTemplate", {
    RESET_OTP: resetOTP,
  });
  await sendEmail(
    trimmedEmail,
    "Reset Your Password - BajarAnio DotCom",
    emailContent
  );

  res.status(200).json({ msg: "OTP sent to email. Valid for 10 minutes." });
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

// 🔹 Reset Password (After OTP Verification)
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) return res.status(404).json({ msg: "User not found" });
  if(newPassword.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters long" });
  }
  if (!user.isOtpVerified)
    return res.status(400).json({ msg: "OTP verification required" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ msg: "newPassword and confirmPassword do not match" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.verificationCode = null;
  user.isOtpVerified = true; // Reset OTP status
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
    maxAge: 10 * 24 * 60 * 60 * 1000, // 1 hour
  });
  res.status(200).json({ msg: "Password reset successful" });
};
// 📌 Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ msg: "New passwords do not match" });
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password is too short. Make it 6 or more characters." });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password is incorrect" });

    // Hash and update the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error, please try again" });
  }
};


exports.logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    path: "/", // Ensure the cookie is cleared for all paths
    httpOnly: true, // Match the httpOnly setting used when setting the cookie
    sameSite: "Lax", // Match the sameSite setting used when setting the cookie
    secure: process.env.NODE_ENV === "production", // Match the secure setting used when setting the cookie
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
