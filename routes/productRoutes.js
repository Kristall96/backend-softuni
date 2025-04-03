import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  rateProduct,
  getProducts,
  getSingleProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ PROTECTED route first — admin only
router.post("/", protect, isAdmin, createProduct);

// Rating route
router.post("/:id/rate", protect, rateProduct);

// Get all products
router.get("/", getProducts);

// Optional test route
router.get("/test", (req, res) => {
  res.json({ message: "Product routes working" });
});
router.get("/:id", getSingleProduct);

export default router;
