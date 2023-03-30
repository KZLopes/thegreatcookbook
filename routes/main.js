const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const indexController = require("../controllers/index");
const userController = require("../controllers/user");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes
router.get("/", indexController.getIndex);

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/logout", authController.logout);

router.get("/feed", ensureAuth, userController.getFeed);

module.exports = router;
