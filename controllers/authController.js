import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login user controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. Return token + basic user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    const savedUser = await newUser.save();

    // ✅ Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Return token and user info
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
