const User = require("../../models/model/User");

exports.respondToFriendRequest = async (req, res) => {
    const { friendId, status } = req.body; // status: "accepted" or "rejected"
    const userId = req.user.id;
  
    try {
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ msg: "Invalid status" });
      }
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!friend) return res.status(404).json({ msg: "Friend not found" });
  
      // Update your friend list
      const userFriend = user.friends.find(f => f.userId.equals(friendId));
      if (!userFriend) return res.status(404).json({ msg: "No friend request found" });
  
      userFriend.status = status;
  
      // Update their friend list
      const friendFriend = friend.friends.find(f => f.userId.equals(userId));
      if (friendFriend) friendFriend.status = status;
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ msg: `Friend request ${status}` });
  
    } catch (error) {
      console.error("Respond to friend request error:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };
  