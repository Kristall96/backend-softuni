import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// ✅ User: update own profile
export const updateUserProfile = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    // 🔑 Generate new token
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
      token, // ✅ send new token to frontend
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
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: update user by ID
export const updateUserById = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;

    const updated = await user.save();
    res.json({ message: "User updated", user: updated });
  } catch (err) {
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
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: grant admin rights
// ✅ Toggle admin rights
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
    res.status(500).json({ message: "Server error" });
  }
};
