const express = require("express");
const router = express.Router();
const deleteUserAccount = require("../controllers/profile/deleteUserAccount");
const {
  editUseName,
  editUserProfilePicture,
} = require("../controllers/profile/editUserInformationController");
const getFullUserInformation = require("../controllers/profile/getFullUserInfoController");
const getUserProfile = require("../controllers/profile/getUserInfoController");
const authMiddleware = require("../controllers/middleware/authMiddleware");
//deleteUserAccount
router.delete("/deleteAccount", authMiddleware, deleteUserAccount);
//getUserProfile
router.get("/getUserProfile", authMiddleware, getUserProfile);
router.get("/getFullUserInformation", authMiddleware, getFullUserInformation);
//editUserName
router.put("/editUserName", authMiddleware, editUseName);
//editUserProfilePicture
router.put("/editUserProfilePicture", authMiddleware, editUserProfilePicture);

module.exports = router;
