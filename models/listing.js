const mongoose = require("mongoose");
const DEFAULT_IMAGE =
  "https://cdn.outsideonline.com/wp-content/uploads/2025/02/wanderlust.jpg?crop=1:1&width=500&enable=upscale&quality=100";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            default: DEFAULT_IMAGE
        }
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;