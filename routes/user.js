const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:id", ensureAuth, userController.getProfile); 

router.get("/:id/recipes", ensureAuth, userController.getRecipes);

router.get("/:id/liked", ensureAuth, userController.getLiked);

router.get("/:id/feed", ensureAuth, userController.getFeed);

router.get("/:id/edit", ensureAuth, userController.editProfile); 

router.put("/:id/update", ensureAuth, userController.updateProfile); 

module.exports = router;
