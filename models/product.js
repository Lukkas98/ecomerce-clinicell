import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock:{
    type: Boolean,
    require: true
  },
  images: {
    type: [String],
    required: true,
  },
});

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", productSchema);
