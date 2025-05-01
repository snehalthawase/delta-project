const mongoose = require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    }
})


userSchema.plugin(passportLocalMongoose);   //use to set username and salted,hashed password..

module.exports=new mongoose.model("User",userSchema);