const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const router = express.Router();
const { saveUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = User({
        email: email,
        username: username,
      });
      await User.register(newUser, password);
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("message", "Welcom to wonderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
    "/login",
    saveUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
      req.flash("message", "Welcome back to Wnaderlust");
      let url = res.locals.url || "/listings";
    res.redirect(url);
  }),
);
router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("message", "successfully logout!");
    res.redirect("/listings");
  });
});

module.exports = router;
