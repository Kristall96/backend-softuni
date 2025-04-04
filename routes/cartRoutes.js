import express from "express";
import {
  addToCart,
  getUserCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getUserCart);
router.patch("/update", protect, updateQuantity);
router.delete("/remove/:productId", protect, removeFromCart);

// ✅ THIS MUST EXIST
export default router;
