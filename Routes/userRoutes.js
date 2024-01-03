import express from "express";
import User from "../Models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());
import dotenv from "dotenv";

dotenv.config();
router.get("/userdetails/", async (req, res) => {
  try {
    const user = await User.find();
    res
      .status(201)
      .json({ message: "user details fetched successfully", user });

    console.log(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// user Register
router.post("/register", async (req, res) => {
  try {
    const { username, password,email,mobile } = req.body;

    const exstingUser = await User.findOne({ username });
    if (exstingUser) {
      res
        .status(400)
        .json({ message: "User already registered try a different name" });
    }
    const newUser = new User({ username, password,mobile,email });
    await newUser.save();

    res.status(201).json({ message: "User Register successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// login user

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(404).json({ message: "user not found!" });
    }
    const isPasswordsValid = await bcrypt.compare(password, user.password);
    if (!isPasswordsValid) {
      res.status(401).json({ message: "invalid passwords!" });
    }

    const secretkey = process.env.JWT_TOKEN;

    const token = jwt.sign({ userId: user.id }, secretkey, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ token,user, message: "User login successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    // Clear the 'token' cookie
    res.clearCookie("token");

    // Optionally, you can perform additional logout logic here if needed

    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    const isPasswordsValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordsValid) {
      res.status(404).json({ message: "invalid password" });
    }
    // Hash the new password
    const hashednewpassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password in the database

    user.password = hashednewpassword;
    await user.save();

    res.status(200).json({ success: "Passwords Changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
