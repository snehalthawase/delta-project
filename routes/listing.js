const express=require("express");
const router=express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
let {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/expresserror.js");
const { isLoggedIn, isOwner, validationListing } = require("../middleware.js");

const listingController= require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,
  upload.single('listing[image][url]'),
   validationListing,
  wrapAsync(listingController.createListing));




//New Route always :/id se upar hona cahiye soo new ko woh id mankar database me na dhunde
router.get("/new",isLoggedIn ,listingController.renderNewForm);

router
.route("/:id")
.get(isLoggedIn, wrapAsync (listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image][url]'),
   wrapAsync (listingController.updateForm))
.delete(
    isLoggedIn,
    isOwner,
     wrapAsync(listingController.destroyListing));
  

     //Edit Route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
   wrapAsync (listingController.renderEditForm));






//Index Route
// router.get("/", wrapAsync(listingController.index));


//Show Route
// router.get("/:id",wrapAsync (listingController.showListing));


//Create Route
// router.post("/",  wrapAsync(listingController.createListing));


//Update Route
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//    wrapAsync (listingController.updateForm));

//delete route
// router.delete("/:id",
//   isLoggedIn,
//   isOwner,
//    wrapAsync(listingController.destroyListing));




module.exports=router;

