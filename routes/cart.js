// routes/cart.js
import express from "express";
import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getUserCart);
router.patch("/update", verifyToken, updateQuantity);
router.delete("/remove/:productId", verifyToken, removeFromCart);

export default router;
