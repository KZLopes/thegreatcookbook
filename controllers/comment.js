const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        author: req.user.id,
        comment: req.body.comment,
        recipe: req.params.id,
        likes: 0,
      });
      console.log("Comment has been added!");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Delete comment from db
      await Comment.deleteOne({ _id: req.params.id });
      console.log("Comment Deleted");
      res.redirect("back");
    } catch (err) {
      res.redirect("/feed");
    }
  },
};
