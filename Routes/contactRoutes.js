import express from "express";
import Contact from "../Models/contactdetails.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
router.get("/getalldetails", async (req, res) => {
  try {
    const AllContact = await Contact.find();
    res.status(201).json({ message: "All details successfully", AllContact });
    console.log(AllContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// create a blog
router.post("/createdetails", upload.single("file"), async (req, res) => {
  const { location, number, email, social_link } = req.body;

  const filepath = req.file ? req.file.path : null;
  const newContact = new Contact({
    location,
    number,
    email,
    social_link,
    file: filepath,
  });
  try {
    const contactDetails = await newContact.save();
    res.status(201).json({ message: "details updated successfully", contactDetails });
    console.log(savedblog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// update a blog by id
router.put("/updateblog/:id", upload.single("file"), async (req, res) => {
  try {
    const updatedblog = await Blogs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedblog) {
      res.status(404).json({ message: "Error updating blog" });
    }
    res.json({ message: "Blog updated successfully", updatedblog });
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
