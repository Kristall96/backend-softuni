import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Error in check-email:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
