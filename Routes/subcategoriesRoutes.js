import express from "express";
const router = express.Router();
import subCategory from "../Models/subcategory.js";
import Category from "../Models/category.js";

router.get("/allproject", async (req, res) => {
  const { category } = req.query;
  try {
    const allprojects = await subCategory.find().populate("category_name");

    if (!category || category === "all") {
      res.json({ allprojects });
    }
    const filteredProducts = allprojects.filter((product) =>
      String(product.category_name)
        .toLowerCase()
        .includes(category.toLowerCase())
    );
    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const allprojects = await subCategory
      .findById(req.params.id)
      .populate("category_name");

    if (!allprojects) {
      res.status(404).json({ error: "No projects found" });
    }

    res
      .status(200)
      .json({ message: "all projects found successfully", allprojects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// creating project routes
router.post(
  "/createproject",

  async (req, res) => {
    try {
      const Categories = await Category.findById(req.body.category_name);
      if (!Categories) {
        return res.status(404).json({ error: "Category not found" });
      } else {
        const { title, image, links, category_name } = req.body;
        const newCategory = new subCategory({
          title,
          image,
          links,
          category_name,
        });

        await newCategory.save();

        res.status(201).json(newCategory);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
router.delete("/:id", async (req, res) => {
  try {
    const deleteproject = await subCategory.findByIdAndDelete(req.params.id);
    if (!deleteproject) {
      req.status(404).json({ error: "project not found" });
    }
    res
      .status(200)
      .json({ message: "Project deleted successfully", deleteproject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/editproject/:id",

  async (req, res) => {
    try {
      const Categories = await Category.findById(req.body.category_name);
      const UpdatedProject = await subCategory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!Categories || !UpdatedProject) {
        return res.status(404).json({ error: "Category not found" });
      } else {
        res
          .status(201)
          .json({ message: "project updated successfully", UpdatedProject });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
export default router;
