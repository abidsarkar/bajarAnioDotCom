const express = require("express");
const router = express.Router();

const {
  deleteUserAccount,
  editUseName,
  editUserProfilePicture,
  getFullUserInformation,
  getUserProfile,
} = require("../controllers/profile/profileControllers");


const  authMiddleware  = require("../controllers/middleware/authMiddleware");
//deleteUserAccount
router.delete("/deleteAccount",authMiddleware, deleteUserAccount);
//getUserProfile
router.get("/getUserProfile", authMiddleware, getUserProfile);
router.get("/getFullUserInformation", authMiddleware, getFullUserInformation);
//editUserName
router.put("/editUserName", authMiddleware, editUseName);
//editUserProfilePicture
router.put("/editUserProfilePicture", authMiddleware, editUserProfilePicture);

module.exports = router;
