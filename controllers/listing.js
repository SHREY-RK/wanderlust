const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  req.session.url = req.originalUrl;
  let data = await Listing.find();
  res.render("listing/index.ejs", { data });
};

module.exports.view = async (req, res) => {
  req.session.url = req.originalUrl;
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
  const { longitude, latitude } = req.body.geometry;

  const newListing = {
    ...req.body.listing,
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  };

  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };
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
  let { description, price } = req.body;
  
  let updateData = {};

  if (price) updateData.price = price;
  if (description) updateData.description = description;

  if (req.file) {
    updateData["image.url"] = req.file.path;
    updateData["image.filename"] = req.file.filename;
  }

  await Listing.findByIdAndUpdate(id, updateData);
  req.flash("message", "Listing updated.");
  res.redirect(`/listings/${id}/view`);
};

module.exports.destroyData = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("deleteListing", "listing deleted.");
  res.redirect("/listings");
};
