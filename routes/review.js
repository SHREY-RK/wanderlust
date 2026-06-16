const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


// validation of schema
const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);

    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}


//API request
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleteListing", "Review deleted.");
    res.redirect(`/listings/${id}/view`);
  }),
);

//adding review: comment, rating
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author = res.locals.currUser;
    await newReview.save();
    await listing.save();
    req.flash("message", "Review inserted.");
    res.redirect(`/listings/${id}/view`);
}))


module.exports = router;