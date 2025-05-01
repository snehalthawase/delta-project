const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,  // ✅ Fixed: Use `String` (uppercase)
        required: true,
    },
    rating: {
        type: Number,  // ✅ Fixed: Use `Number` (uppercase)
        min: 1,
        max: 5,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});

module.exports = mongoose.model("Review", reviewSchema);
