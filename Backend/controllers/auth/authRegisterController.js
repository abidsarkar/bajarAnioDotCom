const User = require("../../models/model/User");
const bcrypt = require("bcryptjs");
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