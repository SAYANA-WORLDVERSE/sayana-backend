import mongoose from "mongoose";

const subSchema = mongoose.Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
  social_links: [
    {
      platform: { type: String },

      link: { type: String },
    },
  ],
  category_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const subCategory = mongoose.model("subCategory", subSchema);
export default subCategory;
