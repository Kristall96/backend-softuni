import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ✅ Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // Check if product already exists in cart
      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// ✅ Get user cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );

    if (!cart) return res.status(200).json({ items: [] });

    const items = cart.items.map((item) => ({
      _id: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      images: item.productId.images,
      quantity: item.quantity,
    }));

    res.status(200).json({ items });
  } catch (err) {
    console.error("Fetch cart error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// ✅ Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

// ✅ Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};
