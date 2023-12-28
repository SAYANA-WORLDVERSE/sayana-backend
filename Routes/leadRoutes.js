import express from "express";
const router = express.Router();
import Lead from "../Models/Leads.js";

// create enquire form api

router.get("/allLeads", async (req, res) => {
  try {
    const allLeads = await Lead.find();
    res
      .status(200)
      .json({ success: "All Leads fetched successfully", allLeads: allLeads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/createlead", async (req, res) => {
  try {
    const { full_name, mobile, email, services, subject, message } = req.body;
    const freshLead = new Lead({
      full_name,
      mobile,
      email,
      services,
      subject,
      message,
    });
    await freshLead.save();
    res.status(201).json({ success: "lead created successfully",freshLead: freshLead });
    console.log("all details", newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
