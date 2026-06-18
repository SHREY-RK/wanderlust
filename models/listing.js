const mongoose = require("mongoose");
const Review = require("./review.js");
const DEFAULT_IMAGE =
  "https://cdn.outsideonline.com/wp-content/uploads/2025/02/wanderlust.jpg?crop=1:1&width=500&enable=upscale&quality=100";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default: DEFAULT_IMAGE,
      set: (v) => {
        return v === "" ? DEFAULT_IMAGE : v;
      },
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;