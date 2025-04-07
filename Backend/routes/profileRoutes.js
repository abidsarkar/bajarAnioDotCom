const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
    cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  }
});
const {
  deleteUserAccount,
  editUserName,
  updateUserProfile,
  getFullUserInformation,
  getUserProfile,
} = require("../controllers/profile/profileControllers");

const authMiddleware = require("../controllers/middleware/authMiddleware");
//deleteUserAccount
router.delete("/delete-account", authMiddleware, deleteUserAccount);
//getUserProfile
router.get("/get-user-profile", authMiddleware, getUserProfile);
router.get(
  "/get-full-user-information",
  authMiddleware,
  getFullUserInformation
);
//editUserName
router.put("/edit-userName", authMiddleware, editUserName);
//editUserProfilePicture
router.put(
  "/update-user-profile-picture",
  authMiddleware,
  upload.single("profilePicture"), // 'profilePicture' should match the field name in your form
  updateUserProfile
);

module.exports = router;
