const mongoose=require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose").default 
  || require("passport-local-mongoose");

  // Add this temporarily to debug:
console.log("[user.js models]--Is  passportLocalMongoose a function?", typeof passportLocalMongoose === "function");

// console.log("Export:", passportLocalMongoose);
// console.log("Type:", typeof passportLocalMongoose);

//defineing schema for User model
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

//passportLocalMongoose adds username and password with hashing salting and salt value aut0matically
userSchema.plugin(passportLocalMongoose);


//creating user model
const User=mongoose.model("User",userSchema);
module.exports = User;