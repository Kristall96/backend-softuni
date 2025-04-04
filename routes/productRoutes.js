import express from "express";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  rateProduct,
  addComment,
  getBestSellers, // ✅ <-- import it
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/best-sellers", getBestSellers); // ✅ <-- register it here
router.get("/:id", getSingleProduct);
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.post("/:id/rate", protect, rateProduct);
router.post("/:id/comment", protect, addComment);

export default router;
