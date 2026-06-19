const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null).optional(),
    }).optional(),
    category: Joi.string()
      .valid(
        "Trending",
        "Rooms",
        "Amazing Pools",
        "Mountains",
        "Beachfront",
        "Arctic",
        "Camping",
        "Forest",
        "Cabins",
        "Lakes",
        "City",
        "Historical",
        "Farms",
        "Castles",
        "Tiny Homes",
        "Surfing",
        "Temples",
        "Iconic Views",
      )
      .required(),
  }).required(),
  geometry: Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required()
})

module.exports = {listingSchema, reviewSchema};