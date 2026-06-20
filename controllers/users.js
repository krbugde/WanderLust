const User=require("../models/user.js");


module.exports.renderFormForSignUpToNewUser=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.saveSignUpUserInDb=async (req, res) => {

    try{
            const { username, email, password } = req.body;

            if (!req.body) {
            req.flash("error", "All fields are required!");
            return res.redirect("/signup");
            }// this "if" is not neccessary because we have implemented validateUser

            const newUser = new User({ 
                username:username,
                email:email
            });

            const registeredUser = await User.register(newUser, password);
            //error "username or user already exists"  if comes when try to save user in DB
            //  ...such errors  gets handled by ExpressError, 
            // IT ALSO shows relevant error meSsage to user on screen

            console.log(`${registeredUser.username} registered successfully`);

            req.login(registeredUser,((err)=>{
                if(err)
                {
                    return next(err);
                }

                req.flash("success","Welcome to WanderLust: You are signed in!"); 
                res.redirect("/listings");
            }));
           }
    catch(err)
    {
        req.flash("error",err.message);
        return res.redirect("/signup");
    }
    
  };


  module.exports.renderLogInFormToUser=async(req,res)=>{

    res.render("users/login.ejs");

};


module.exports.postLogin=async(req,res)=>{

        // res.send("Welcome to WanderLust: You are logged in!");   
        req.flash("success","Welcome to WanderLust: You are logged in!");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        //means:
        // 👉 “If res.locals.redirectUrl exists, use it. Otherwise, go to /listings.”

        res.redirect(redirectUrl);      

};


module.exports.logoutUser=async(req,res,next)=>{ 

    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        else{
            req.flash("success","You are logged out !");
            res.redirect("/listings");
        }
    });

};