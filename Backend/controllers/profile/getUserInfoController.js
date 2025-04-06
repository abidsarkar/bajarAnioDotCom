const User = require("../../models/model/User");
// 🔹 Get User Information (After Login)
exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || "",
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  };