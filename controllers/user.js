const Recipe = require("../models/Recipe");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const recipes = await Recipe.find({ author: req.params.id });
      const author = await User.findOne({_id: req.params.id});
      res.render("profile.ejs", { recipes: recipes, user: req.user, author: author });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipes: async (req,res) => {
    try {
      const recipes = await Recipe.find({ author: req.params.id });
      // recipes -> all recipes from id in the params
      res.render("feed.ejs", { recipes: recipes, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  getLiked: async (req,res) => {
    try {
      const author = await User.find({ author: req.params.id }).populate('liked').sort({ createdAt: "desc" }).lean();
      // recipes -> array with all the recipes liked by the user with the id present in the parameters
      if (author.liked) {
        res.render("feed.ejs", { recipes: author.liked, user: req.user});
      } else {
        res.redirect('back')
      }
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find().populate('author', 'userName').sort({ createdAt: "desc" }).lean();

      res.render("feed.ejs", { recipes: recipes, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },

}