const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");

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
  wrapAsync(reviewControllers.destroyReview),
);

//adding review: comment, rating
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));


module.exports = router;