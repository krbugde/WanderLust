// MIDDLEWARES in this files ARE USED IN listing.js and review.js

//requiring models
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const isLoggedIn=(req,res,next)=>{

    console.log(req.user);//it prints all user related info 
    if(!req.isAuthenticated())  //req.isAuthenticated() is a method which checks is the user is logged in or not .
    {
        //saving redirectUrl 
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}



//this function is used to check whether the current
//  user who is trying to edit or delete a particular listing ,
// is he/she the owner of that listing, if yes, 
// they he can do edit/delete else not
const isItOwner=async(req,res,next)=>{

    let{id}=req.params;

    let listing=await Listing.findById(id); // we require to import listing model for this line in this file
    if(!listing.owner._id.equals(res.locals.currentUser._id))
        {
            req.flash("error","You are not the owner of this listing!!");
            return res.redirect(`/listings/${id}`);
        }
    next();
}


const isItReviewOwner=async(req,res,next)=>{

    let{id,reviewId}=req.params;

    let review=await Review.findById(reviewId); // we require to import listing model for this line in this file
    if(!review.author._id.equals(res.locals.currentUser._id))
        {
            req.flash("error","You are not the author of this Review!!");
            return res.redirect(`/listings/${id}`);
        }
    next();
}


module.exports={isLoggedIn,saveRedirectUrl,isItOwner,isItReviewOwner};