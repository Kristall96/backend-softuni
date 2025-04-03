import mongoose from "mongoose";

// ⬇️ Comment schema separated for flexibility
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ⭐ Rating schema (only 1 per user)
const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ One rating per user
    ratings: [ratingSchema],

    // 💬 Multiple comments per user (up to 10 handled in controller)
    comments: [commentSchema],

    // ✅ Category
    category: {
      type: String,
      enum: [
        "best-seller",
        "most-liked",
        "new-arrival",
        "limited-edition",
        "seasonal",
        "staff-picks",
        "classic-collection",
      ],
      default: "new-arrival",
    },

    // ✅ Mug-specific attributes
    capacity: {
      type: Number,
      required: true,
    },
    material: {
      type: String,
      enum: ["Ceramic", "Glass", "Stainless Steel", "Plastic", "Clay"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    pattern: {
      type: String,
      enum: ["Solid", "Printed", "Textured", "Custom"],
      default: "Solid",
    },

    // ✅ Stock as number instead of boolean
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    tags: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
