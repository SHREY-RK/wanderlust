const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})
router.post("/signup", wrapAsync(async (req, res) => {
    try {

        let { username, email, password } = req.body;
        const newUser = User({
            email: email,
            username: username
        })
        await User.register(newUser, password);
        req.flash("message", "Welcome to wanderlust.");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})
router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(async (req, res) => {
    req.flash("message", "Welcome back to Wnaderlust");
    res.redirect("/listings");
}))

module.exports = router;