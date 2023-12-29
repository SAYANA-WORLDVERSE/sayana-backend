import express from "express";
import Career from "../Models/Career.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

const upload = multer({ storage: storage,fileFilter: fileFilter });

// get All candidate
router.get("/allcandidates", async (req, res) => {
  try {
    const allCandidates = await Career.find();
    if (!allCandidates) {
      res.status(404).json({ message: "no candidates found" });
    }
    res.status(200).json({
      message: "All Candidates fetched successfully",
      allCandidates: allCandidates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create candidate

router.post("/applycandidates", upload.single("file"), async (req, res) => {
  const { full_name, mobile, email, position, message } = req.body;

  const exstingCandidate = await Career.findOne({ email });
  if (exstingCandidate) {
    res.status(200).json({
      message: "You have already submitted your application for this position.",
    });
  }

  const filepath = req.file ? req.file.path : null;
  const newCandidate = new Career({
    full_name: full_name,
    mobile: mobile,
    email: email,
    position: position,
    message: message,
    file: filepath ? `upload/${path.basename(filepath)}` : null,
  });
  try {
    const savedCandidates = await newCandidate.save();
    res.status(201).json({
      message: "User Register successfully!",
      newCandidate: savedCandidates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const candidate = await Career.findByIdAndDelete(req.params.id);
    if (!candidate) {
      res.status(404).json({ message: "candidate not found" });
    }
    res.status(200).json({ messsage: "candidate deleted", candidate });
  } catch (error) {
    res.status(500).json({ message: "error deleting candidate", error: error.message });
  }
});
export default router;
