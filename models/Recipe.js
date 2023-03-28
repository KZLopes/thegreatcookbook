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
    type: Number,
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
    type: Array,
    required: true,
  },
  walkthrough: {
    type: String,
    required: true,
  },
  tips: {
    type: String,
    required: false,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
