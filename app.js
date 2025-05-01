if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
// console.log(process.env.SECRET)


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const joi=require("joi");
let {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/reviews.js");
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');



const flash=require("connect-flash");
const passport=require("passport");
const localStrategy =require("passport-local");
const User=require("./models/user.js");
const userRoute=require("./routes/user.js");



const ExpressError=require("./utils/expresserror.js");




const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

  async function main() {
    await mongoose.connect(dbUrl);
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // ✅ FIXED
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// // demo user
// app.get("/demoUser",async(req,res)=>{
// let fakeUser= new User({
//   email:"shibhangithwase@gmial.com",
//   username:"shinbhangi thawase",
// })
// let newUser =await User.register(fakeUser,"happening world");
// res.send(newUser);
// })

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
  })

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.get("/", (req, res) => {
  res.redirect("/listings");
});


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"))
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});