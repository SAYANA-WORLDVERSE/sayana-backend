import express from "express";
import Category from "../Models/category.js";
const router = express.Router();

router.get("/allcategory", async (req, res) => {
  try {
    const category = await Category.find();
    if (!category) {
      res
        .status(404)
        .json({ message: "No category found", error: error.message });
    }
    res.status(200).json({ message: "All categories fetched", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/createcategory", async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(200).json({ message: "Category already exists" });
    }
    const newcategory = new Category({
      name
    });

    await newcategory.save();

    res.status(201).json({ message: "Category created sucessfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res
      .status(200)
      .json({ message: "category deleted sucessfully", category: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
