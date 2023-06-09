const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

module.exports = {
  getLogin: (req, res) => {
    if (req.user) {
      return res.redirect("/user/"+req.user._id);
    }
    res.render("login", {
      title: "Login",
    });
  },

  postLogin: (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (validator.isEmpty(req.body.password))
      validationErrors.push({ msg: "Password cannot be blank." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", info);
        return res.redirect("/");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/user/"+user._id);
      });
    })(req, res, next);
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err)
        console.log(
          "Error : Failed to destroy the session during logout.",
          err
        );
    req.logout(() => {
      console.log("User has logged out.");
    });
      req.user = null;
      res.redirect("/");
    });
  },

  getSignup: (req, res) => {
    if (req.user) {
      return res.redirect("/user/"+req.user._id);
    }
    res.render("signup", {
      title: "Create Account",
      user: req.user
    });
  },

  postSignup: async (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (req.body.password !== req.body.confirmPassword)
      validationErrors.push({ msg: "Passwords do not match" });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    let data = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });
    try {
      if (data) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      } else {
        try {
          await user.save();
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/user/"+ req.user._id);
          });
        } catch (err) {
          return next(err);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
};
