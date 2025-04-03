import mongoose from "mongoose";

// Allow up to 10 comments per user
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
  comment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Limit images to 10
const arrayLimit = (val) => val.length <= 10;

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

    // ✅ Support up to 10 image URLs
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
      default: ["https://via.placeholder.com/300"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Ratings and Comments combined
    ratings: [ratingSchema],

    // ✅ Shop filters
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

    capacity: {
      type: Number, // in milliliters
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

    // ✅ Quantity-based stock
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
