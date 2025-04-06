const User = require("../../models/model/User");


exports.getFullUserInformation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "friends.userId",
      select: "username profilePicture", // Select only these fields
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Transform the friends array to include relevant data
    const friends = user.friends.map((friend) => ({
      id: friend.userId._id,
      username: friend.userId.username,
      profilePicture: friend.userId.profilePicture,
      userEmail: friend.userEmail,
      status: friend.status,
      createdAt: friend.createdAt,
    }));

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || "",
      friends: friends, // Send the populated friends array
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};