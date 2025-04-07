const express = require("express");
const router = express.Router();

const {
  sendFriendRequest,
  respondToFriendRequest,
  removeFriend,
} = require("../controllers/friends/friendController");
const authMiddleware = require("../controllers/middleware/authMiddleware");
//add remove and change friends status
router.post("/send-friend-request", authMiddleware, sendFriendRequest);
router.put("/respond", authMiddleware, respondToFriendRequest);
router.delete("/remove/:friendId", authMiddleware, removeFriend);

module.exports = router;
