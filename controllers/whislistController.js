// controllers/wishlistController.js
import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    "items"
  );
  res.status(200).json(wishlist?.items || []);
};

export const toggleWishlistItem = async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ userId: req.user._id, items: [productId] });
  } else {
    const exists = wishlist.items.includes(productId);
    wishlist.items = exists
      ? wishlist.items.filter((id) => id.toString() !== productId)
      : [...wishlist.items, productId];
  }

  await wishlist.save();
  res.status(200).json(wishlist.items);
};
