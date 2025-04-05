import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  rateProduct,
  addComment,
  getBestSellers,
  deleteProduct,
  getMostLikedProducts,
  getNewArrivals,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Specific routes first
router.get("/best-sellers", getBestSellers);
router.get("/most-liked", getMostLikedProducts);
router.get("/new-arrivals", getNewArrivals); // 🟢 Move this ABOVE the `/:id` route

// ✅ General routes after specific ones
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post("/", protect, isAdmin, createProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.post("/:id/rate", protect, rateProduct);
router.post("/:id/comment", protect, addComment);

export default router;
