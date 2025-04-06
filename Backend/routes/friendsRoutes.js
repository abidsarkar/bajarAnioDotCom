const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
} = require("../controllers/friends/sendFriendRequest");
const {
  respondToFriendRequest,
} = require("../controllers/friends/respondToFriendRequest");
const { removeFriend } = require("../controllers/friends/removeFriend");

const { verifyJWT } = require("../controllers/middleware/authMiddleware");

router.post("/friends/add", verifyJWT, sendFriendRequest);
router.put("/friends/respond", verifyJWT, respondToFriendRequest);
router.delete("/friends/remove", verifyJWT, removeFriend);

module.exports = router;
