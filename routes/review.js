const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expresserror.js");
let {listingSchema,reviewSchema}=require("../schema.js");

const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

const { validationReview ,isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController= require("../controllers/review.js");




//review route 
//post route

router.post("/",
  isLoggedIn,
  validationReview, wrapAsync(reviewController.createReview))

// delete review route 
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview))

module.exports = router;  //imp
