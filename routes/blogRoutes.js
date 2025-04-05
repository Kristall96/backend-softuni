import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBlog,
  getBlogs,
  getBlogById,
} from "../controllers/blogController.js";
import { getRandomBlogs } from "../controllers/blogController.js";
import { addCommentToBlog } from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, createBlog); // Admin restriction optional
router.post("/:id/comments", protect, addCommentToBlog);
router.get("/random", getRandomBlogs);
export default router;
