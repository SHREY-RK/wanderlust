const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.url = req.originalUrl;
      req.flash("error", "please log in to your account!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req, res, next) => {
  if (req.session.url) {
    res.locals.url = req.session.url;
  }
  next();
}

module.exports.isOwner = async(req, res, next)=> {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (res.locals.currUser && !res.locals.currUser.equals(listing.owner)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/listings/${id}/view`);
  }
  next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if (res.locals.currUser && !res.locals.currUser._id.equals(review.author)) {
    req.flash("error", "you do not have permission!");
    return res.redirect(`/listings/${id}/view`);
  }
  next();
}