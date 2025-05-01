const { types } = require("joi");
const Listing=require("../models/listing");
let {listingSchema}=require("../schema.js");
require('dotenv').config();

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };


  module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author"
    }}).populate("owner");
    console.log(listing);
    if(!listing){
      req.flash("error","listing you are trying to find does not exits");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  }






  // module.exports.createListing=async (req, res,next) => {
  //   // if(!req.body.listing){
  //   //   throw new ExpressError(404,"provide proper listings");
  //   // }
  //   let url=req.file.path;
  //   let filename=req.file.filename;
  
  //   let result = listingSchema.validate(req.body);
  
  //   console.log(result);
  // if(result.error){
  //   throw new ExpressError(404,result.error);
  // }
  //     const newListing = new Listing(req.body.listing);
  //     newListing.owner=req.user._id;
  //     newListing.image={url,filename};
  //    await newListing.save();
  //    req.flash("success","New Listing Created");
  //   res.redirect("/listings");
  
  // }




  module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
  
    let result = listingSchema.validate(req.body);
    console.log(result);
  
    if (result.error) {
      throw new ExpressError(404, result.error);
    }
  
    const { location } = req.body.listing;
    const apiKey = process.env.MAP_TOKEN;
   
    // 🔁 Step 1: Make API call to LocationIQ
    const apiUrl = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(location)}&format=json`;

  
    try {
      const response = await fetch(apiUrl); // native fetch (Node v22+)
      const data = await response.json();
  
      const { lat, lon } = data[0];
      console.log(`Coordinates: ${lat}, ${lon}`);
  
      // 🔁 Step 2: Create and Save the Listing
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = { url, filename };
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)]
      };
  
      // Optional: Attach coordinates (if you later decide to use them)
      // newListing.coordinates = { lat, lon };
  
      let checking =await newListing.save();
      console.log(checking);
      req.flash("success", "New Listing Created");
     res.redirect("/listings")
      // res.redirect("/listings"); // use this after testing
    } catch (err) {
      console.error("Geolocation Error:", err);
      res.status(500).send("Error fetching coordinates");
    }
  };
  



  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing you are trying to find does not exits");
      return res.redirect("/listings")
    }
  let originalUrl=listing.image.url;
  originalUrl= originalUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { listing,originalUrl });
  }


  module.exports.updateForm = async (req, res) => {
    let { id } = req.params;
  
    
  
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

if(typeof req.file !=="undefined")
   {
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();

}
    req.flash("success", "Listing edited");
    res.redirect(`/listings/${id}`);
  };
  

  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findOneAndDelete({ _id: id }); // ✅ Corrected
    req.flash("success"," Listing deleted");
    console.log(deletedListing);
    res.redirect("/listings");
  }