const User = require("../../models/model/User");
const cloudinary = require("../../models/config/cloudinary");
const fs = require('fs');
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
exports.updateUserProfile = async (req, res) => {
  let oldPublicId = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Get current user data first
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Extract public ID from current profile picture if not default
    if (user.profilePicture && 
        user.profilePicture !== "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png") {
      const urlParts = user.profilePicture.split('/');
      const filename = urlParts[urlParts.length - 1];
      oldPublicId = `bajarAnio/${filename.split('.')[0]}`;
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bajarAnio",
      width: 500,
      height: 500,
      crop: "fill"
    });

    // Update user's profile picture in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password -verificationCode -verificationCodeExpires');

    // Delete old image from Cloudinary if it exists
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (err) {
        console.error("Error deleting old image from Cloudinary:", err);
        // Don't fail the request if deletion fails
      }
    }

    res.status(200).json({
      msg: "Profile picture updated successfully",
      imageUrl: result.secure_url
    });

  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  } finally {
    // Clean up the temporary file
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting temporary file:", err);
      }
    }
  }
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
