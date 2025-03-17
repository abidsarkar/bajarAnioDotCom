//import part
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();
//middleware
app.use(cookieParser()); // Enable Cookie Parsing
app.use(express.json());
app.use(cors());

//connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
//Routes
app.use("/api/auth", require("./routes/authRoutes"));
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
