const mongoose=require("mongoose");
const Schema=mongoose.Schema;

///One lsiting can have multiple reviews...One to many relation where listing is one and reviews is many
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;