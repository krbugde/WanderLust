//acts as middleware for validating the data send throuht post via hopscotch directly

const Joi = require('joi');


const listingSchema = Joi.object({
        title: Joi.string().required(),
        //  image: Joi.string().allow("", null),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required();


const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
}).required();


module.exports = { listingSchema, reviewSchema };