if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
    // console.log(process.env.SECRET);
}

const dbUrl = process.env.ATLAS_DB_URL;
console.log(dbUrl);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";

// //requiring models
// const Listing=require("./models/listing.js");
// const Review=require("./models/review.js");
const User=require("./models/user.js");

const path=require("path");
const { render } = require("ejs");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

// //requiring utils files
// const wrapAsync = require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError.js");

//requiring session
const session=require("express-session");
const flash=require("connect-flash");

//requiring joi schema of models for validation
const { listingSchema, reviewSchema } = require('./joi_schema.js');

//require routers
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//configuration strategy imports for authentication and authorization
const passport=require("passport");
const LocalStrategy=require("passport-local");


//connecting to database
main().then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});

async function main()
{
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}
//======================================================================

//defining our session options
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,  //after one weel cookie should gete xpired
        maxAge:7*24*60*60*1000,
        httpOnly:true //used for securitu against cross scripting attacks
    }
};

//====================================================
// app.get("/",(req,res)=>{
//     res.send("Hi I am root ");
// });
//===============================================

app.use(session(sessionOptions));
app.use(flash());  //flast and sessions need to be used before starting the routes code

//======================================================
//AUTHETICATION AND AUTHORIZATION RELATED SETUP  REQUIRED FOR USER IS IMPLEMENTED HERE

app.use(passport.initialize()); //runs for each request
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========================================================================

//Each and every  middleware runs for eeach and very request
//This middleware is  for flash and also one which stored current logged in user in res.locals.currentUser 
//accessing the flash messaged via their keys
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");

    res.locals.currentUser=req.user;
            //res.locals.currentUser = req.user;.... is used to make the logged-in user available in all your EJS views (templates).
            // 🔹 What is res.locals?
            // res.locals is an object in Express that stores variables that are:
            // available only during that request
            // automatically passed to your rendered views (.ejs, .pug, etc.)

    console.log("success flash msg =", res.locals.successMsg);
    console.log("error flash msg =", res.locals.errorMsg);

    next();
});
//============================================================

//using routers for incoming requests diverting
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", usersRouter);

//creating a demo user to test congiguration of passport
// app.get("/demouser",async(req,res)=>{

//     let fakeUser=new User({
//         email:"stud@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld"); //helloworld is entered  password of that "fake user"..
//     //method syntax-> register(user,password,callback[optional]);..this method saves the created user and its credentials in the database

//    res.send(registeredUser);
// });


//======================================================================================

// app.get("/testListing",async(req,res)=>{
//     try{

//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"near the beach",
//         price:1200,
//         location:"goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample data saved in database");
//     res.send("successfull testing");
//     }
//     catch(err){
//         console.log("sample data not saved in database");
//         res.send("unsuccessfull testing");
//     }

// });

//===========================================================
//=============================================================
//ERROR HANDLING MIDDLEWARES :)-->

// app.use() WITHOUT err → catches unmatched routes
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Not found"));
// });
// 👉 This only runs when:
// No route matched
// User enters wrong URL
// ✔ So yes — this is your 404 handler

// 🧠 2. app.use(err, req, res, next) → handles actual errors
// app.use((err, req, res, next) => {
//     res.status(err.status || 500).send(err.message);
// });
// 👉 This runs when:
// You call next(err)
// You throw an error in async routes
// Something crashes in your logic

// ✔ This is your global error handler

app.use((req, res, next) => {
    next(new ExpressError(404, "Requested URL/Page not found!"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    console.log("error type/name: ",err.name,"||  error message:  ",err.message);
    let{status=500,message="OOPs!! SOMETHING WENT WRONG!!"}=err;
    res.status(status).render("error.ejs",{err});
    console.log(err.stack);
});

//===========================
app.listen(port,()=>{
    console.log("server listening to port 8080");
});





