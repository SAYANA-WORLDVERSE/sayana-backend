import mongoose from "mongoose";

const subSchema = mongoose.Schema({
  title: { type: String, required: true },
  image: [{ type: String, required: true }],
  links: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref:'Category',required: true,unique: false },
});

const subcategory =mongoose.model('subCategory',subSchema);
export default subcategory;