import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    "items"
  );
  res.status(200).json(wishlist?.items || []);
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ userId: req.user._id, items: [productId] });
  } else if (!wishlist.items.includes(productId)) {
    wishlist.items.push(productId);
  }

  await wishlist.save();
  res.status(200).json({ message: "Added to wishlist", wishlist });
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

  wishlist.items = wishlist.items.filter((id) => id.toString() !== productId);
  await wishlist.save();
  res.status(200).json({ message: "Removed from wishlist" });
};
