const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipe");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Render New Recipe Form
router.get("/new", recipesController.newRecipe);

router.post("/createRecipe", upload.single("file"), recipesController.createRecipe);

// Go to a Specific Recipe
router.get("/:id", ensureAuth, recipesController.getRecipe);

router.put("/:id/likeRecipe", recipesController.likeRecipe);

router.delete("/:id/deleteRecipe", recipesController.deleteRecipe);

module.exports = router;
