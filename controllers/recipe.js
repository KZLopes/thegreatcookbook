const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find()
        .populate("author", "userName")
        .sort({ createdAt: "desc" })
        .lean();
      const user = await User.findOne({ _id: req.user.id });

      res.render("feed.ejs", { recipes: recipes, user: user });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate("author");
      const comments = await Comment.find({ recipe: req.params.id })
        .populate("author")
        .sort({ createdAt: "desc" })
        .lean();

      comments.forEach(
        (comment) =>
          (comment.createdAt = comment.createdAt.toLocaleString("pt-br", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }))
      );

      res.render("recipe.ejs", {
        recipe: recipe,
        user: req.user,
        author: recipe.author,
        comments: comments,
      });
    } catch (err) {
      console.log(err);
    }
  },
  newRecipe: (req, res) => {
    try {
      res.render("newRecipe.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      await Recipe.create({
        title: req.body.title,
        author: req.user.id,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        prepTime: req.body.prepTime,
        portions: req.body.portions,
        likes: 0,
        ingredients: req.body.ingredients,
        walkthrough: req.body.walkthrough,
        tips: req.body.tips,
      });
      console.log("Recipe has been added!");
      res.redirect("/user/" + req.user.id);
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res) => {
    try {
      // Check if user already liked the recipe
      if (req.user.liked.includes(req.params.id)) {
        // Remove recipe id from user liked array
        await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $pull: { liked: req.params.id },
          }
        );
        // Decrease the number of likes in the recipe by 1
        await Recipe.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
          }
        );
        console.log("Likes -1");
      } else {
        // Add recipe id to user liked array
        await User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: { liked: req.params.id },
          }
        );
        // Increase the number of likes in the recipe by 1
        await Recipe.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
          }
        );
        console.log("Likes +1");
      }
      res.redirect(`back`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete recipe from db
      await Recipe.deleteOne({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/user/" + req.user.id);
    } catch (err) {
      res.redirect("back");
    }
  },
  editRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate("author");
      res.render("editRecipe.ejs", { user: req.user, recipe: recipe });
    } catch (err) {
      console.log(err);
    }
  },
  updateRecipe: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            prepTime: req.body.prepTime,
            portions: req.body.portions,
            ingredients: req.body.ingredients,
            walkthrough: req.body.walkthrough,
            tips: req.body.tips,
          },
        }
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
};
