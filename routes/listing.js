const express=require("express");
const router=express.Router();

//requiring isLoggedIn middleware to check is user is logged in or not...from middleware.js file
const { isLoggedIn, saveRedirectUrl ,isItOwner,isItReviewOwner} = require("../middleware.js");

//requiring models
const Listing=require("../models/listing.js");

//requiring utils files
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");

//requiring joi schema of models for validation
const { listingSchema, reviewSchema } = require('../joi_schema.js');

//requiring controller
const listingController=require("../controllers/listings.js");

//requiring things related for cloudinary->to store images,files on cloudinary
const multer=require("multer");

//requiring important things from cloudConfig.js file
const  {storage}=require("../cloudConfig.js");


const upload=multer({storage});  //stores file on cloudinary under the  folder specified by "storage"
// const upload=multer({dest:"uploads/"}); 



// using the validating middlewares using joi
const validateListing=((req,res,next)=>{
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



router.route("/")
    //index route->retrives all listings title and displays
    .get(wrapAsync(listingController.index))

    //create route-> this rout insert new created listing in database 
    .post(  isLoggedIn,
            upload.single("ListingImage"),
            validateListing,
            wrapAsync(listingController.insertNewCreatedListingInDb)
          );
    
  
//new route///thir route works when user clicks on create new listing button present in index.ejs
//this route renders a form for creating a new listing
router.get("/new",isLoggedIn,listingController.renderCreateListingForm);


router.route("/:id")
    //show route-> shows specific listing details/information  based on id
    .get(wrapAsync(listingController.showSpecificListingDetails))

    //UPDATE/put route->this route will update the listing in database based on its specified id
    .put(isLoggedIn,isItOwner,upload.single("ListingImage"),validateListing,listingController.updateEditedListingInDb)

    //DELETE ROUTE->THIS ROUTE WILL DELETE SPECIFIED LISTING BASED ON THE PARTICULAR ID OF THAT LISTING
    .delete(isLoggedIn,isItOwner,listingController.deleteSpecifiedListing);



//edit route->this route will render a form which allows to edit a particular listing info
router.get("/:id/edit",isLoggedIn,isItOwner,wrapAsync(listingController.renderFormToEditListing));



module.exports=router;