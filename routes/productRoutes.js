import express from "express";
import {
  createProduct,
  rateProduct,
  getProducts,
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

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

export default router;
