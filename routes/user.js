const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const router = express.Router();
const { saveUrl } = require("../middleware.js");

const userControllers = require("../controllers/user.js");

router.get("/signup", userControllers.signupForm);
router.post(
  "/signup",
  wrapAsync(userControllers.newUser),
);

router.get("/login", userControllers.loginForm);
router.post(
    "/login",
    saveUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userControllers.oldUser),
);

router.get("/logout", userControllers.logoutUser);

module.exports = router;
