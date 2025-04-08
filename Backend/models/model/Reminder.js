const mongoose = require("mongoose");
const ReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  source: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "https://unsplash.com/photos/bunch-of-red-apples-wXuzS9xR49M",
  },
  dueTime: {
    type: Date,
  },
  priority: {
    type: String,
    enum: {
      values: ["Low", "Medium", "High"],
      message: "Priority must be Low, Medium, or High",
    },
    default: "Low",
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});
module.exports = mongoose.model("Reminder", ReminderSchema);
