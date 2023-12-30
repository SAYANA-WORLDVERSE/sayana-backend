import mongoose from "mongoose";

const subSchema = mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  links: [{ type: String, required: true }],
  category_name: { type: mongoose.Schema.Types.ObjectId, ref:'Category',required: true },
});

const subCategory =mongoose.model('subCategory',subSchema);
export default subCategory;