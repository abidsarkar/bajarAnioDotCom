const mongoose = require("mongoose");
const ReminderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
  },
  friendEmail: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  source: { type: String },
  image: { type: String }, // URL to stored image
  dueTime: { type: Date },
  mandatoryLevel: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  isCompleted: { type: Boolean, default: false },
});
export default mongoose.model("Reminder", ReminderSchema);
