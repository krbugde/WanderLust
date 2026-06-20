const Listing=require("../models/listing.js");

//await cloudinary.uploader.destroy(deletedListing.image.filename);
// the above line needs the below cloudinary
const { cloudinary } = require("../cloudConfig.js");

module.exports.index=async(req,res,next)=>{
       
            const allListings= await Listing.find({});
            res.render("listings/index.ejs", { allListings });
};

module.exports.renderCreateListingForm=(req,res)=>{
     
        res.render("listings/new.ejs");
    
};


module.exports.insertNewCreatedListingInDb=async(req,res,next)=>{
    
    if(!req.file)
    {
        req.flash("error","Please upload an image");
        return res.redirect("/listings/new");
    }

    let img_url=req.file.path;
    let img_name=req.file.filename;
    console.log(img_url,"...",img_name)

   if (!req.body) {
        req.flash("error","Enter valid details add Listing");
        return res.redirect("/new");
    }// this "if" is not neccessary because we have implemented validateListing

    let{title,description,price,country,location}=req.body;

    let newListing=new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country
    });

    //passport by default stored the current user info in req.user
    newListing.owner=req.user._id;

    newListing.image = {
        url: img_url,
        filename: img_name
    };


    // if(!newListing.title)
    // {
    //      throw new ExpressError(400, "Title is missing");
    // }
    // if(!newListing.description)
    // {
    //      throw new ExpressError(400, "Description is missing");
    // }
    // if(!newListing.price)
    // {
    //      throw new ExpressError(400, "Price is missing");
    // }
    // if(!newListing.location)
    // {
    //      throw new ExpressError(400, "Location is missing");
    // }
    // if(!newListing.country)
    // {
    //      throw new ExpressError(400, "country is missing");
    // }
    //Other way to validate above fileds is by using "joi"

    await newListing.save();
    req.flash("success","New listing added successfully!!");
    console.log("new listing data saved in database");
    console.log(newListing);
    res.redirect("/listings");
   
};


module.exports.showSpecificListingDetails=async(req,res)=>{
    let {id}=req.params;

    const listing=await Listing.findById(id)
                    .populate({path:"reviews",populate:{
                        path:"author"
                    }})
                    .populate("owner");
   
    if(!listing) 
    {
        req.flash("error","listing you requested for doesnt't exist!!");
        return res.redirect("/listings");
        // throw new ExpressError(404, "Listing not found!");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.renderFormToEditListing=async(req,res)=>
{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing) {
        req.flash("error","listing you requested for doesnt't exist!!");
        return res.redirect("/listings");
        // throw new ExpressError(404, "Listing not found!");
    }

    let original_image_url=listing.image.url;
    original_image_url=original_image_url.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing , original_image_url}); 
};

module.exports.updateEditedListingInDb=async(req,res,next)=>{
    try{


    let{id}=req.params;
    let { title, description, price, country, location } = req.body;

     // 1. Fetch the existing listing FIRST, so we know the old image's public_id
        let existingListing = await Listing.findById(id);
        
        if (!existingListing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }


     let updateData = {
            title:title,
            description:description,
            price:price,
            location:location,
            country:country
        };

     // Only touch the image field if a new file was actually uploaded
        if (req.file) //check if req.file exists you can also write as-> if(typeof req.file!=="undefined"){ ... }
        {
            updateData.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }


    let listing = await Listing.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

     // 4. If a new image was uploaded AND an old image existed, delete the old one from Cloudinary
        if (req.file && existingListing.image && existingListing.image.filename) {
            await cloudinary.uploader.destroy(existingListing.image.filename);
        }
        // What does cloudinary.uploader.destroy() need to delete the old existing listing image?
        // It needs the public_id, not the URL. In your schema:
        // image: {
        //     url: String,
        //     filename: String
        // }
        // filename is what multer-storage-cloudinary stores as the public_id

    req.flash("success","listing updated successfully!!");
    console.log("listing updated");
    res.redirect(`/listings/${id}`);
    }
    catch(err){
        next(err);
    }
};


module.exports.deleteSpecifiedListing=async(req,res,next)=>{
    try{
        let {id}=req.params;

        let deletedListing=await Listing.findByIdAndDelete(id);
        console.log(deletedListing.reviews);
        //findByIdAndDelete() will automatically 
        // by default will call the post delete middleware->findOneAndDelete() defined 
        // in listing.js under models folder
        //due to this, the all reviews related to that listing will also be get deleted from "reviews" collection 

        // Delete the associated image from Cloudinary, if it exists
        if (deletedListing.image && deletedListing.image.filename) {
            await cloudinary.uploader.destroy(deletedListing.image.filename);
        }

        req.flash("success","listing deleted successfully!!");
        console.log("deleted listing->");
        console.log(deletedListing);
        console.log("listing  deleted from database");
        console.log("all reviews related with that listing  also deleted from 'reviews' collection in the database");
        res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
};
