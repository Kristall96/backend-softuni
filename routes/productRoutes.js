import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  rateProduct,
  addComment,
  getBestSellers,
  getMostLikedProducts,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Specific routes FIRST
router.get("/best-sellers", getBestSellers);
router.get("/most-liked", getMostLikedProducts);

// ✅ Generic routes BELOW
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post("/", protect, isAdmin, createProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.post("/:id/rate", protect, rateProduct);
router.post("/:id/comment", protect, addComment);

export default router;
