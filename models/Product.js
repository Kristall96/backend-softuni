import mongoose from "mongoose";

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
    ratings: [ratingSchema],

    // ✅ Category for homepage filtering
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

    // ✅ Mug-specific filters for shop page
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
    inStock: {
      type: Boolean,
      default: true,
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
