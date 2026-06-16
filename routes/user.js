const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const router = express.Router();
const { saveUrl } = require("../middleware.js");

const userControllers = require("../controllers/user.js");


router
  .route("/signup")
  .get(userControllers.signupForm)
  .post(wrapAsync(userControllers.newUser));;



router
  .route("/login")
  .get(userControllers.loginForm)
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userControllers.oldUser),
  );;

router.get("/logout", userControllers.logoutUser);

module.exports = router;
