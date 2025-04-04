import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  rateProduct,
  addComment,
  getBestSellers,
  deleteProduct, // ✅ use it now
} from "../controllers/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { getMostLikedProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/best-sellers", getBestSellers);
router.get("/:id", getSingleProduct);
router.post("/", protect, isAdmin, createProduct);
router.delete("/:id", protect, isAdmin, deleteProduct); // ✅ protect with admin
router.post("/:id/rate", protect, rateProduct);
router.post("/:id/comment", protect, addComment);
router.get("/most-liked", getMostLikedProducts);

export default router;
