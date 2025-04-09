//import part
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
//middleware
app.use(cookieParser()); // Enable Cookie Parsing
app.use(express.json());
app.use(cors());
//db connection
const connectDB = require("./models/config/db");
const passport = require("./models/config/passport");
connectDB();
app.use(passport.initialize());
//importing routes
const authRoutes = require("./routes/authRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reminder", reminderRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
