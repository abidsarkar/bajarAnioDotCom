const User = require("../../models/model/User");
exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ msg: "unauthorized access" });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    await User.findByIdAndDelete(userId);
    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong", error: err.message });
  }
};
