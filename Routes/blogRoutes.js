import express from "express";
import Blogs from "../Models/blog.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path"
import fs from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const objectId = mongoose.Types.ObjectId;

// multer storage configuration
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const destinationDir = path.join(__dirname, "../upload");

    // Check if the destination directory exists, create it if not
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

// get All Blogs
router.get("/getallblogs", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.status(201).json({ message: "All Blogs fetched successfully", blogs });
    console.log(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// get blog by id
router.get("/:id", async (req, res) => {
  try {
    if (!objectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const blog = await Blogs.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// create a blog

router.post("/createblog", upload.single("file"), async (req, res) => {
  const { title, description } = req.body;

  const filepath = req.file ? req.file.path : null;
  const newBlog = new Blogs({
    title,
    description,
    file: filepath ? `upload/${path.basename(filepath)}` : null,
  });
  try {
    const savedblog = await newBlog.save();
    res.status(201).json({ message: "Blog saved successfully", savedblog });
    console.log(savedblog);
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: error.message });
  }
});


// update a blog by id
router.put("/updateblog/:id", upload.single("file"), async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!objectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const blogToUpdate = await Blogs.findById(req.params.id);
    if (!blogToUpdate ) {
      res.status(404).json({ message: "Error updating blog" });
    }
    blogToUpdate.title = title;
    blogToUpdate.description = description;

    if (req.file) {
      // If a new file is uploaded, update the file path
      blogToUpdate.file = `upload/${path.basename(req.file.path)}`;
    }
    const updatedBlog = await blogToUpdate.save();

    res.json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete a blog by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedblog = await Blogs.findByIdAndDelete(req.params.id);
    if (!deletedblog) {
      res.status(404).json({ message: "Blog not found" });
    }
    res.json(deletedblog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
