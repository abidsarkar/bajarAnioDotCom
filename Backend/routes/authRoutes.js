const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
//register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, ProfilePictureSrc } = req.body;
    //check if user already exist
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    //Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //save User
    user = new User({
      name,
      email,
      password: hashPassword,
      ProfilePictureSrc: ProfilePictureSrc || "",
    });
    await user.save();
    res.status(201).json({ message: "User Register successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//user Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid user" });
    //compare pass
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({message:"password is wrong"})
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email,
            friendList: user.friendList,
            ProfilePictureSrc: user.ProfilePictureSrc
        } 
    });
  } catch (err) {res.status(500).json({ error: err.message });}
});
module.exports = router;
