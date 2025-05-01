const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");

const userController=require("../controllers/user");



router
.route("/signUp")
.get(userController.renderSignup)
.post(wrapAsync (userController.Signup))


router
.route("/login")
.get(userController.renderLogin)

.post(
    savedRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
 }) ,userController.login)



 //logout

router.get("/logout",userController.logOut)

module.exports=router;





//signUp
// router.get("/signUp",userController.renderSignup)

// router.post("/signUp",wrapAsync (userController.Signup))

//login

// router.get("/login",userController.renderLogin)

//  router.post("/login",
//     savedRedirectUrl,
//     passport.authenticate("local",{
//     failureRedirect:"/login",
//     failureFlash:true,
//  }) ,userController.renderLogin)



