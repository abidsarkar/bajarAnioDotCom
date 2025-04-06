const User = require("../../models/model/User");
exports.removeFriend = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
      if (!friend) return res.status(404).json({ msg: "Friend not found" });
  
      // Remove from both friend lists
      user.friends = user.friends.filter(f => !f.userId.equals(friendId));
      friend.friends = friend.friends.filter(f => !f.userId.equals(userId));
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ msg: "Friend removed successfully" });
  
    } catch (error) {
      console.error("Remove friend error:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };
  