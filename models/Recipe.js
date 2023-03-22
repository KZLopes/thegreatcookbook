const mongoose = require("mongoose");

// Add users who liked to prevent multiple likes from the same user
const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  prepTime: {
    type: String,
    required: true,
  },
  portions: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  walkthrough: {
    type: String,
    required: true,
  },
  tips: {
    type: String,
    required: true,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
