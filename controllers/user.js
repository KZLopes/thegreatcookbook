const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const author = await User.findOne({ _id: req.params.id })
        .populate("liked")
        .populate("featured")
        .sort({ createdAt: "desc" })
        .lean();
      const recipes = await Recipe.find({ author: req.params.id });

      if (!author.featured) {
        author.featured = {"image": "https://res.cloudinary.com/dmyro6sg5/image/upload/v1681157134/featured-placeholder.png"}
      }
      res.render("profile.ejs", {
        favs: author.liked,
        recipes: recipes,
        user: req.user,
        author: author,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.find({ author: req.params.id });
      // recipes -> all recipes from id in the params
      res.render("feed.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getLiked: async (req, res) => {
    try {
      const author = await User.find({ author: req.params.id })
        .populate("liked")
        .sort({ createdAt: "desc" })
        .lean();
      if (author.liked) {
        res.render("feed.ejs", { recipes: author.liked, user: req.user });
      } else {
        res.redirect("back");
      }
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find()
        .populate("author", "userName")
        .sort({ createdAt: "asc" })
        .lean();

      res.render("feed.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  editProfile: async (req, res) => {
    try {
      res.render("editProfile.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  updateProfile: async (req, res) => {
    try {
      if (req.body.file) {
        let img = await cloudinary.uploader.upload(req.file.path);
        await User.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              userName: req.body.userName,
              avatar: img.secure_url,
              cloudinaryId: img.public_id,
              aboutMe: req.body.aboutMe,
            },
          }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              userName: req.body.userName,
              aboutMe: req.body.aboutMe,
            },
          }
        );
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  },
};