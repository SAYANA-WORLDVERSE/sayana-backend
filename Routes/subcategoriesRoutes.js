import express from "express";
const router = express.Router();
import SubCategory from "../Models/subcategory.js";
import Category from "../Models/category.js";



router.post(
  "/createsub/:categoryId",

  async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      console.log(category)
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const { title, image, links } = req.body;
      const newProduct = new SubCategory({
        title,
        image,
        links,
        categoryId: category,
      });
      await newProduct.save();

      category.push(newProduct);
      await category.save();

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
export default router;
