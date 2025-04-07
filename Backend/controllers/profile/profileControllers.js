const User = require("../../models/model/User");

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate user exists and is authorized
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Perform deletion
    await User.findByIdAndDelete(userId);

    // Clear any authentication cookies/tokens
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Account deletion error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
exports.editUserName = async (req, res) => {
  try {
    const UserId = req.user.id;
    if (!UserId) {
      return res.status(401).json({ msg: "unauthorized access" });
    }
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ msg: "Username is required" });
    }
    let user = await User.findById(UserId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.username = username;
    await user.save();
    res.json({ msg: "Username updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};
exports.editUserProfilePicture = async (req, res) => {
  try {
    console.log("profile picture upload logic not implemented yet");
    console.log("req.file", req.file);
  } catch (err) {}
};
//full info with friends profile and name
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
        
        friends: friends, // Send the populated friends array
      });
    } catch (error) {
      // console.error("Error getting user profile:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };
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
