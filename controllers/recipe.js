const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find().populate('author', 'userName').sort({ createdAt: "desc" }).lean();
      const user = await User.findOne({_id: req.user.id});

      res.render("feed.ejs", { recipes: recipes, user: user});
    } catch (err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate('author');
      const comments = await Comment.find({ recipe: req.params.id, user: req.user })
        .sort({ createdAt: "desc" })
        .lean();
        
      res.render("recipe.ejs", {recipe: recipe, user: req.user, author: recipe.author, comments: comments});
    } catch (err) {
      console.log(err);
    }
  },
  newRecipe: (req, res) => {
    try {
      res.render("newRecipe.ejs", {user: req.user});
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
      res.redirect("/user/"+req.user.id);
    } catch (err) {
      console.log(err);
    }
  },
  //Maybe change to Toogle like 
  likeRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
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
      res.redirect("/user/"+req.user.id);
    } catch (err) {
      res.redirect("back");
    }
  },
};
