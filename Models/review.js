import mongoose from "mongoose";

const review=mongoose.Schema({

    name: {type:String, required:true},
    rating:Number,
    title:String,
    Date:{type:Date, default:Date.now},
    description:{type:String, required:true},

})

const Review=mongoose.model('Review',review);
export default Review;