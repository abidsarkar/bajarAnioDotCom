const Reminder = require ("../../models/model/Reminder");

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const { friendId, title, description, source, dueTime, priority } = req.body;
    const userId = req.user.id;

    const reminder = new Reminder({
      userId,
      friendId,
      title,
      description,
      source,
      dueTime,
      priority,
      image: req.file?.path // If you're handling file uploads
    });

    await reminder.save();

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all reminders for a user
exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isCompleted } = req.query;

    let query = { userId };
    if (isCompleted) query.isCompleted = isCompleted === 'true';

    const reminders = await Reminder.find(query)
      .populate('friendId', 'username profilePicture')
      .sort({ dueTime: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single reminder
exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('friendId', 'username profilePicture');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'source', 'dueTime', 'priority', 'isCompleted'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        error: 'Invalid updates!'
      });
    }

    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    updates.forEach(update => reminder[update] = req.body[update]);
    if (req.body.isCompleted) {
      reminder.completedAt = new Date();
    }
    reminder.updatedAt = new Date();

    await reminder.save();

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};