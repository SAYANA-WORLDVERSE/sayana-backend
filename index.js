import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import connectDB from "./Database/db.js";
import blogRoutes from "./Routes/blogRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
import candidateRoutes from "./Routes/CareerRoutes.js";
import LeadRoutes from "./Routes/leadRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import subcategoryRoutes from "./Routes/subcategoriesRoutes.js";
import ContactRoutes from "./Routes/contactRoutes.js";
import cors from "cors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use('/upload', express.static(path.join(__dirname, '../upload')));
app.get('/upload/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'upload', filename));
});
app.use("/blog", blogRoutes);
app.use("/", userRoutes);
app.use("/review", reviewRoutes);
app.use("/candidate", candidateRoutes);
app.use("/contact", LeadRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategory", subcategoryRoutes);
app.use("/contact", ContactRoutes);

app.listen(port, () => {
  console.log(`server connected to the port ${port}`);
});
