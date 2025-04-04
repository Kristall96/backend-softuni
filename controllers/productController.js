import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      images, // ✅ updated to support multiple image URLs
      category,
      capacity,
      material,
      color,
      pattern,
      stock,
      isFeatured,
      tags,
    } = req.body;

    // ✅ Validate required fields
    if (!title || !price || !capacity || !material || !color) {
      return res
        .status(400)
        .json({ message: "Missing required product fields." });
    }

    // ✅ Validate images array (optional: limit to 10)
    const validImages =
      Array.isArray(images) && images.length > 0
        ? images.slice(0, 10) // max 10 images
        : ["https://via.placeholder.com/300"]; // default fallback

    const product = new Product({
      title,
      description,
      price,
      images: validImages, // ✅ use validated image array
      category,
      capacity,
      material,
      color,
      pattern,
      stock: stock || 0,
      isFeatured: isFeatured || false,
      tags,
      createdBy: req.user._id,
    });

    await product.save();

    res
      .status(201)
      .json({ message: "✅ Product created successfully", product });
  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
    const {
      search,
      material,
      color,
      pattern,
      inStock,
      minPrice,
      maxPrice,
      capacityMin,
      capacityMax,
      page = 1,
      limit = 25,
    } = req.query;

    const filter = {};

    // Search by title (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Exact match filters
    if (material) filter.material = material;
    if (color) filter.color = color;
    if (pattern) filter.pattern = pattern;
    if (inStock !== undefined) filter.inStock = inStock === "true";

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Capacity range
    if (capacityMin || capacityMax) {
      filter.capacity = {};
      if (capacityMin) filter.capacity.$gte = Number(capacityMin);
      if (capacityMax) filter.capacity.$lte = Number(capacityMax);
    }

    const currentPage = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 25;
    const skip = (currentPage - 1) * pageSize;

    // Count total matching products
    const total = await Product.countDocuments(filter);

    // Fetch paginated products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      products,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("❌ Fetch products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "ratings.user",
      "username"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Get single product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const addComment = async (req, res) => {
  const { score, comment, userId } = req.body;
  const productId = req.params.id;

  if (!score || !comment || !userId) {
    return res
      .status(400)
      .json({ message: "Score, comment, and user ID are required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Limit to 10 comments per user
    const userComments = product.ratings.filter(
      (r) => r.user.toString() === userId
    );
    if (userComments.length >= 10) {
      return res.status(400).json({
        message: "You have reached the 10 comment limit for this product.",
      });
    }

    product.ratings.push({ user: userId, score, comment });
    await product.save();

    res
      .status(201)
      .json({ message: "Comment added", ratings: product.ratings });
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { isFeatured: true } },
      { $sample: { size: 5 } }, // Get 7 random best sellers
    ]);
    res.status(200).json({ products });
  } catch (error) {
    console.error("❌ Best sellers fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    await product.remove();

    res.status(200).json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMostLikedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$ratings.score" },
        },
      },
      { $sort: { averageRating: -1 } },
      { $limit: 7 },
    ]);
    res.status(200).json({ products });
  } catch (error) {
    console.error("❌ Most liked fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
