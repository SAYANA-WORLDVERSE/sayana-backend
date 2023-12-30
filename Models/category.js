import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
