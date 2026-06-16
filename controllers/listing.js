const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let data = await Listing.find();
  res.render("listing/index.ejs", { data });
};

module.exports.view = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "Your requested listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listing/view.ejs", { data, id });
};

module.exports.newForm = (req, res) => {
  res.render("listing/add.ejs");
};

module.exports.sendNewData = async (req, res, next) => {
  const newListing = req.body.listing;
  console.log(res.locals.currUser);
  if (res.locals.currUser) {
    newListing.owner = res.locals.currUser._id;
  }
  await Listing.insertOne(newListing);
  req.flash("message", "Successfully insert property.");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Your requested listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listing/edit.ejs", { data: listing });
};

module.exports.editData = async (req, res) => {
  let { id } = req.params;
  let { description, price, url } = req.body;
  if (price != "") {
    await Listing.findByIdAndUpdate(id, { price: price });
  }
  if (description != "") {
    await Listing.findByIdAndUpdate(id, { description: description });
  }
  if (url != "") {
    await Listing.findByIdAndUpdate(
      id,
      { "image.url": url },
      { returnDocument: "after" },
    );
  }
  req.flash("message", "Listing updated.");
  res.redirect(`/listings/${id}/view`);
};

module.exports.destroyData = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("deleteListing", "listing deleted.");
  res.redirect("/listings");
};
