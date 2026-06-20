const express=require("express");

//requiring isLoggedIn middleware to check is user is logged in or not...from middleware.js file
const { isLoggedIn, saveRedirectUrl ,isItOwner,isItReviewOwner} = require("../middleware.js");

//{ mergeParams: true } -> This tells Express to merge the parent route's params (:id from /listings/:id/reviews) into req.params inside the child router.
const router=express.Router({ mergeParams: true });

//requiring models
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

//requiring utils files
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");

//requiring joi schema of models for validation
const { listingSchema, reviewSchema } = require('../joi_schema.js');

//requiring controller
const reviewController=require("../controllers/reviews.js");


// validating middlewares using joi
const validateReview=((req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

});

//if user is logged in then can only create a review
//Adding a review for a specific listing based on the listing's id.
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReviewForSpecificListing));


//delete route->deleting a specific review present on 
// specific listing..from "reviews" collection 
//as well as from that specific "listing's"->"reviews" array

//id->listing id
router.delete("/:reviewId",isLoggedIn,isItReviewOwner,wrapAsync(reviewController.deleteReview));


module.exports=router;