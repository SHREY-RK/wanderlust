const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const listingControllers = require("../controllers/listing.js");

// validation of schema
const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);

  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

router.route("/")
  .get(listingControllers.index)
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingControllers.sendNewData),
  );;



//for detail view of property
router.get(
  "/:id/view",
  wrapAsync(listingControllers.view),
);

//new property adding and collect data
router.get("/new", isLoggedIn, listingControllers.newForm);


//edit property
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingControllers.editForm),
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editData),
);

//delete property and review
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.destroyData),
);

module.exports = router;
