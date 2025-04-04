// models/Wishlist.js
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

export default mongoose.model("Wishlist", wishlistSchema);
