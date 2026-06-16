const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  newReview.author = res.locals.currUser;
  await newReview.save();
  await listing.save();
  req.flash("message", "Review inserted.");
  res.redirect(`/listings/${id}/view`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleteListing", "Review deleted.");
    res.redirect(`/listings/${id}/view`);
}
  