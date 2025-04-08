const express = require("express");
const router = express.Router();
const authMiddleware = require("../controllers/middleware/authMiddleware");

const {
  createReminder,
  getReminders,
  getReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminder/reminderControllers");
router.post("/create-reminder", authMiddleware, createReminder);
router.get("/get-all-reminders", authMiddleware, getReminders);
router.get("/get-single-reminder/:id", authMiddleware, getReminder);
router.patch("/update-reminder/:id", authMiddleware, updateReminder);
router.delete("/delete-reminder/:id", authMiddleware, deleteReminder);
module.exports = router;
