const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const indexController = require("../controllers/index");
const recipesController = require("../controllers/recipe");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes
router.get("/", indexController.getIndex);
router.get("/profile", ensureAuth, recipesController.getProfile);
router.get("/feed", ensureAuth, recipesController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
