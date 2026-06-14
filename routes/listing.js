const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema");
const Listing = require("../models/listing.js");


// validation of schema
const validateListing = (req, res, next)=> {
    let result = listingSchema.validate(req.body);

    if(result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}

//home page all property
router.get("/", async (req, res)=> {
    let data = await Listing.find();
    res.render("listing/index.ejs", {data});
})

//for detail view of property
router.get("/:id/view", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    if (!data) {
        req.flash("error", "Your requested listing does not exist");
        return res.redirect("/listings");
    } 
    res.render("listing/view.ejs", {data, id});
}))

//new property adding and collect data
router.get("/new", (req, res)=> {
    res.render("listing/add.ejs");
})
router.post("/", validateListing, wrapAsync(async (req, res, next)=> {
    await Listing.insertOne(req.body.listing);
    req.flash("message", "Successfully insert property.")
    res.redirect("/listings");
})) 

//edit property
router.get("/:id/edit", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Your requested listing does not exist");
      return res.redirect("/listings");
    } 
    res.render("listing/edit.ejs", {data: listing});
}))
router.put("/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    let {description, price, url} = req.body;
    if (price!="") {
        await Listing.findByIdAndUpdate(id, {price: price});
    }
    if (description!="") {
        await Listing.findByIdAndUpdate(id, {description: description});
    }
    if (url!="") {
        await Listing.findByIdAndUpdate(id, {"image.url": url},{ returnDocument: "after" });
    }
    req.flash("message", "Listing updated.")
    res.redirect(`/listings/${id}/view`);
}))

//delete property and review
router.delete("/:id/delete", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleteListing", "listing deleted.")
    res.redirect("/listings");
}))


module.exports = router;