import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ User: update own profile
export const updateUserProfile = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check for duplicate username/email (excluding current user)
    const usernameExists = await User.findOne({
      username,
      _id: { $ne: req.user._id },
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Update values
    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    // ✅ Send new token
    const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
      token,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: update user by ID
export const updateUserById = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check for duplicate username/email (excluding current user)
    const usernameTaken = await User.findOne({
      username,
      _id: { $ne: userId },
    });
    if (usernameTaken) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const emailTaken = await User.findOne({
      email,
      _id: { $ne: userId },
    });
    if (emailTaken) {
      return res.status(400).json({ message: "Email already registered" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    const updated = await user.save();
    res.json({ message: "User updated", user: updated });
  } catch (err) {
    console.error("Admin update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: toggle admin rights
export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { makeAdmin } = req.body;
    user.isAdmin = !!makeAdmin;

    await user.save();

    res.json({
      message: `User is now ${makeAdmin ? "admin" : "regular user"}`,
    });
  } catch (err) {
    console.error("Toggle admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
