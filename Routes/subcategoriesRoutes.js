import express from "express";
import subCategory from "../Models/subcategory.js";
import Category from "../Models/category.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer storage configuration

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationDir = path.join(__dirname, "../upload");
    try {
      await fs.access(destinationDir);
    } catch (error) {
      await fs.mkdir(destinationDir, { recursive: true });
    }
    cb(null, destinationDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.get("/getallproject", async (req, res) => {
  try {
    const allprojects = await subCategory.find().populate("category_name");
    if (!allprojects) {
      req.status(404).json({ message: "no projects found" });
    }

    res.status(200).json({message:"all projects fetched", allprojects: allprojects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/allproject", async (req, res) => {
  const { category } = req.query;
  try {
    const allprojects = await subCategory.find().populate("category_name");

    if (allprojects) {
      const filteredProjects = allprojects.filter((project) =>
        String(project.category_name)
          .toLowerCase()
          .includes(category.toLowerCase())
      );
      res.status(200).json({ allprojects: filteredProjects });
    } else {
      res.status(404).json({ error: "No projects found" });
    }
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
  upload.single("file"),

  async (req, res) => {
    try {
      const Categories = await Category.findById(req.body.category_name);
      if (!Categories) {
        return res.status(404).json({ error: "Category not found" });
      } else {
        const { title, social_links, category_name } = req.body;
        const filepath = req.file ? req.file.path : null;
        const newCategory = new subCategory({
          title,
          file: filepath ? `upload/${path.basename(filepath)}` : null,
          social_links,
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
