import mongoose from 'mongoose';

const CareerSchema=mongoose.Schema({
    full_name:{type:String, required:true},
    mobile:{type:Number, required:true},
    email:{type:String, required:true},
    position:{type:String,required:true},
    file:{type:String},
    message:{type:String, required:true},
})

const Career=mongoose.model("Career", CareerSchema);
export default Career;