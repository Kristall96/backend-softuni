import express from "express";
import {
  createProduct,
  rateProduct,
} from "../controllers/productController.js";

import { getProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.post("/:id/rate", rateProduct);
router.get("/test", (req, res) => {
  res.json({ message: "Product routes working" });
});
router.get("/", getProducts);
export default router;
