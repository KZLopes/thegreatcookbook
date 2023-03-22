const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comment");
// const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Comment Routes
router.post("/createComment/:id",  commentsController.createComment);

router.put("/likeComment/:id",  commentsController.createComment);

router.delete("/deleteComment/:id", commentsController.deleteComment);

module.exports = router;