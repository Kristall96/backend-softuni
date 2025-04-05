// routes/blogRoutes.js
import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  addCommentToBlog,
  getRandomBlogs, // ✅ imported
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Place this ABOVE `/:id` to avoid conflict
router.get("/random", getRandomBlogs);

// ✅ Order matters: this should be below
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, createBlog);
router.post("/:id/comments", protect, addCommentToBlog);

export default router;
