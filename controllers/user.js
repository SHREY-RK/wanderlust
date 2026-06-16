const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.newUser = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.oldUser = async (req, res) => {
  req.flash("message", "Welcome back to Wnaderlust");
  let url = res.locals.url || "/listings";
  res.redirect(url);
};

module.exports.logoutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("message", "successfully logout!");
    res.redirect("/listings");
  });
};