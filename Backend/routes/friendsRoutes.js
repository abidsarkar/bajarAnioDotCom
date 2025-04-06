const express = require("express");
const router = express.Router();
const sendFriendRequest = require("../controllers/friends/sendFriendRequest");
const respondToFriendRequest = require("../controllers/friends/respondToFriendRequest");
const removeFriend = require("../controllers/friends/removeFriend");
const authMiddleware = require("../controllers/middleware/authMiddleware");
//add remove and change friends status
router.post("/add", authMiddleware, sendFriendRequest);
router.put("/respond", authMiddleware, respondToFriendRequest);
router.delete("/remove", authMiddleware, removeFriend);

module.exports = router;
