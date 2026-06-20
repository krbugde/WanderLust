const express=require("express");
const router=express.Router();
const passport=require("passport");

const User=require("../models/user.js");

//requiring utils files
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");

//requiring joi schema of models for validation
const { listingSchema, reviewSchema } = require('../joi_schema.js');
const { isLoggedIn, saveRedirectUrl,isItOwner,isItReviewOwner } = require("../middleware.js");

//requiring controller
const userController=require("../controllers/users.js");


// validating middlewares using joi
const validateUser=((req,res,next)=>{
    let {error}=listingSchema.validate(req.body); 
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

});


router.route("/signup")
        //renders form for signup to new user
        .get(userController.renderFormForSignUpToNewUser)

        //registers the new user and saves it in database
        .post(wrapAsync(userController.saveSignUpUserInDb));



router.route("/login")
        //it renders login form to user when user click on login option in navbar
        .get(wrapAsync(userController.renderLogInFormToUser))

        //passport.authenticate(strategy,options[optional]) is a middleware that DOES THE WORK OF 
        // CHECKING WETHERE THE USER WHO IS TRYING 
        // TO LOG IN WAS THERE  ALREADY IN DATABASE 
        // ..MEANS HAD DID SIGNUP
        .post(saveRedirectUrl,
            passport.authenticate(
                "local",{  failureRedirect:"/login",
                        failureFlash:true}),
                wrapAsync(userController.postLogin));

// What passport.authenticate("local") does

// Passport uses the Local Strategy to verify the username/email and password submitted in the login form.

// If credentials are correct:

// req.user is created.
// The user is logged in.
// Execution moves to the next middleware (wrapAsync(...)).

// If credentials are incorrect:

// Execution stops.
// User is redirected according to failureRedirect.
// Error flash message is created because of failureFlash.

// failureRedirect: "/login"
// failureRedirect: "/login"
// If login fails, Passport redirects the user back to:

// /login
// Example:

// User enters wrong password.
// Passport checks credentials.
// Authentication fails.
// Browser is redirected to /login.
// failureFlash: true
// failureFlash: true

// Automatically creates a flash message when authentication fails.

// For example:
// Missing credentials
// or
// Incorrect username
// or
// Incorrect password
// depending on what your strategy returns.

//===================================================

//you can also implement wrapAsync for this below route 
router.get("/logout",userController.logoutUser);

module.exports=router;