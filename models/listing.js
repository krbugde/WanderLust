const mongoose=require("mongoose");
const Review=require("./review.js");

const listing_schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        required:true
    },
    location:String,
    country:String,

    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"  //model name
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"  //model name
    }
});

//IMPLEMENTING A "POST DELETE MIDDLEWARE -> findOneAndDelete" WHICH TRIGGERS/GET CALLED, AUTOMATICALLY WHEN THE "findByIdAndDelete()"" method is called to delete a specific review

listing_schema.post("findOneAndDelete", async (listing_to_be_deleted) => {

    if (
        listing_to_be_deleted &&
        listing_to_be_deleted.reviews &&
        listing_to_be_deleted.reviews.length > 0
    ) {
        await Review.deleteMany({
            _id: { $in: listing_to_be_deleted.reviews }
        });
    }
});

const Listing=mongoose.model("Listing",listing_schema);
module.exports=Listing;


//original schema before we implemented functionality of storeing the listing images on cloudinary
// const listing_schema=new mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     description:String,
//     image:{
//         type:String,
//         default:"https://images.unsplash.com/photo-1780789595474-2e1b3ffda0de?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         set: (v) =>
//             v === ""
//             ? "https://images.unsplash.com/photo-1780789595474-2e1b3ffda0de?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//             : v
//         //set → A setter function that runs before the value is saved to MongoDB.
//         //The setter checks:
//         // v === ""
//         // If the value is an empty string (""), it stores "default link" instead.
//         // Otherwise, it stores the value provided by the user.
//     },
//     price:{
//         type:Number,
//         required:true
//     },
//     location:String,
//     country:String,

//     reviews:[
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"Review"  //model name
//         }
//     ],
//     owner:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"  //model name
//     }
// });