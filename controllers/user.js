const User=require("../models/user");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signUp.ejs")
 }

 module.exports.Signup=async (req,res)=>{
    try{
        let { email, username, password } = req.body; // ✅ Destructuring from req.body

        let newUser= new User({email,username});
        let registeredUser= await User.register(newUser,password); 
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to WanderLust");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
   
}


module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs")
 }

 module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to WanderLust");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
     }

module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
    }     