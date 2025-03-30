// ✅ routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  updateUserProfile,
  updateUserById,
  deleteUser,
  makeAdmin,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 Regular user: update own profile
router.put("/profile", protect, updateUserProfile);

// 🛡️ Admin: all user controls
router.get("/", protect, isAdmin, getAllUsers);
router.put("/:id", protect, isAdmin, updateUserById);
router.delete("/:id", protect, isAdmin, deleteUser);
router.put("/:id/make-admin", protect, isAdmin, makeAdmin);

export default router;
