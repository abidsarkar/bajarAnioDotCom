const User = require("../../models/model/User");
//respond to a friend request
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
  //remove friends
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
  //send friend request
  exports.sendFriendRequest = async (req, res) => {
    const { friendEmail } = req.body;
    const requesterId = req.user.id;
  
    try {
      if (!friendEmail) return res.status(400).json({ msg: "Friend email is required" });
  
      const friendUser = await User.findOne({ email: friendEmail });
      if (!friendUser) return res.status(404).json({ msg: "User not found with that email" });
  
      if (friendUser._id.equals(requesterId)) {
        return res.status(400).json({ msg: "You cannot add yourself" });
      }
  
      const requester = await User.findById(requesterId);
  
      // Check if friend already exists in either list
      const alreadyFriend = requester.friends.some(f => f.userId.equals(friendUser._id));
      if (alreadyFriend) return res.status(400).json({ msg: "Friend request already sent or user already added" });
  
      // Add to requester's friend list
      requester.friends.push({
        userId: friendUser._id,
        userEmail: friendUser.email,
        status: "pending",
      });
  
      // Optionally: Add reverse entry in friend's list (status: "pending")
      friendUser.friends.push({
        userId: requester._id,
        userEmail: requester.email,
        status: "pending",
      });
  
      await requester.save();
      await friendUser.save();
  
      res.status(200).json({ msg: "Friend request sent" });
  
    } catch (error) {
      console.error("Friend request error:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };