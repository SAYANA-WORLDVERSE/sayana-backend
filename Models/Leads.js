import mongoose from 'mongoose';

const LeadSchema = mongoose.Schema({
    full_name:String,
    mobile:Number,
    email:String,
    services:String,
    subject:String,
    message:String,

});

const Lead=mongoose.model('Lead',LeadSchema);
export default Lead;