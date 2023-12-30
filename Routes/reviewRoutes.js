import express from "express";
import Review from "../Models/review.js";
const router = express.Router();
import mongoose from "mongoose";

const objectId = mongoose.Types.ObjectId;

router.get("/Allreviews", async (req, res) => {
  try {
    const allReviews = await Review.find();
    res.status(200).json({ message: "All Reviews fetched", data: allReviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!objectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const singleReview = await Review.findById(req.params.id);

    if (!singleReview) {
      res.status(404).json({ message: "Review not found" });
    }
    res.json(singleReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/createReview", async (req, res) => {
  try {
    const { name, rating, title, description } = req.body;
    const review = await Review({ name, rating, title, description });
    review.save();
    res.status(201).json({ message: "review saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/editReview/:id", async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReview) {
      res.status(404).json({ message: "Review not found" });
    }
    res
      .status(200)
      .json({ message: "Review updated", updatedReview: updatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deletereview/:id", async (req, res) => {
  try {
    const deletedreview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedreview) {
      res.status(404).json({ message: "review not found" });
    }
    res.status(200).json({
      message: "review deleted successfully",
      deletedreview: deletedreview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
