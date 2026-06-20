//requiring models
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");



//if user is logged in then can only create a review
//Adding a review for a specific listing based on the listing's id.
//post route
module.exports.addReviewForSpecificListing=async(req,res)=>{
    let {id}=req.params;

    if (!req.body) {
        throw new ExpressError(400, "Send valid data for listing");
    } // this "if" is not neccessary because we have implemented validateReview
    
    let listing=await Listing.findById(id); //find listing for which review is created
    if(!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    let{rating,comment}=req.body;

    let new_Review= new Review({
        rating:rating,
        comment:comment
    });

    new_Review.author=req.user._id; //savinf the user/author id who created the review

    listing.reviews.push(new_Review);

    await new_Review.save();

    console.log(new_Review);
    console.log("Review data saved in database");
    await listing.save();
    console.log("Listing updated with its review data in database");

    console.log(new_Review);

    let listing__with_review=await Listing.findById(id); 
    console.log(listing__with_review);

    req.flash("success","New Review for the listing added successfully!!");
   
    res.redirect(`/listings/${id}`);
    
};



//delete route->deleting a specific review present on 
// specific listing..from "reviews" collection 
//as well as from that specific "listing's"->"reviews" array

//id->listing id
module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //remove that review from the listing first

    await Review.findByIdAndDelete(reviewId); //This removes the review from the "reviews" collection
   
    console.log("review deleted from 'reviews collection' as well as from listing");
    req.flash("success","Review deleted successfully!!");
    res.redirect(`/listings/${id}`);
};