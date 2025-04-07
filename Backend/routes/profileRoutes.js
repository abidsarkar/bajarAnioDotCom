const express = require("express");
const router = express.Router();

const {
  deleteUserAccount,
  editUserName,
  editUserProfilePicture,
  getFullUserInformation,
  getUserProfile,
} = require("../controllers/profile/profileControllers");


const  authMiddleware  = require("../controllers/middleware/authMiddleware");
//deleteUserAccount
router.delete("/delete-account",authMiddleware, deleteUserAccount);
//getUserProfile
router.get("/get-user-profile", authMiddleware, getUserProfile);
router.get("/get-full-user-information", authMiddleware, getFullUserInformation);
//editUserName
router.put("/edit-userName", authMiddleware, editUserName);
//editUserProfilePicture
router.put("/editUserProfilePicture", authMiddleware, editUserProfilePicture);

module.exports = router;
