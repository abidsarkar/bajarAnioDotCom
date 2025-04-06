const User = require("../../models/model/User");

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
