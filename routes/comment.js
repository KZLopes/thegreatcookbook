const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comment");
// const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Comment Routes
router.post("/:id/create",  commentsController.createComment);

router.put("/:id/like",  commentsController.createComment);

router.delete("/:id/delete", commentsController.deleteComment);

module.exports = router;