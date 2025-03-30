import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  console.log("Current user:", req.user); // 👈 Add this temporarily

  const { title, description, price, image, category } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const product = new Product({
      title,
      description,
      price,
      image,
      category,
      createdBy: req.user._id, // ✅ This line failed because req.user is undefined
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Rate a product
export const rateProduct = async (req, res) => {
  const { score, comment, userId } = req.body;
  const productId = req.params.id;

  if (!score || !userId) {
    return res.status(400).json({ message: "Score and user ID are required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Prevent duplicate rating by the same user
    const alreadyRated = product.ratings.find(
      (r) => r.user.toString() === userId
    );
    if (alreadyRated) {
      return res
        .status(400)
        .json({ message: "You have already rated this product" });
    }

    product.ratings.push({ user: userId, score, comment });
    await product.save();

    res
      .status(201)
      .json({ message: "Rating added successfully", ratings: product.ratings });
  } catch (err) {
    console.error("Rating Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
