const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      immutable: true, // Ensures email cannot be changed after creation
      index: true
    },
    password: { type: String, required: true },
    googleId: { 
      type: String, 
      index: true 
    },
    profilePicture: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    friends: [
      {
        userId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User',
          required: true,
          index: true
        },
        userEmail: {  // Now safe to include since emails are immutable
          type: String,
          required: true,
          index: true
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
          index: true
        },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Compound indexes for optimized queries
UserSchema.index({ 'friends.status': 1, 'friends.userId': 1 });
UserSchema.index({ 'friends.userEmail': 1 }); // Fast email-based friend lookups

module.exports = mongoose.model("User", UserSchema);