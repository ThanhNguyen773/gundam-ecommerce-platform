import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
      set: v => Number(parseFloat(v).toFixed(2))
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    modelUrl: {
      type: String,
      required: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
   
    detectedLabel: {
      type: String,
      default: "",
    },
    isActive: { type: Boolean, default: true },
    sold: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;