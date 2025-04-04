// controllers/cartController.js
import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.status(200).json(cart);
};

// Create getUserCart, updateQuantity, and removeFromCart similarly
