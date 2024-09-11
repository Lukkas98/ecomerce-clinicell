import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
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
    ref: "Category",
    required: true,
  },
  additionalCategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  ],
  stock: {
    type: Boolean,
    require: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  if (this.isModified("description")) {
    this.description =
      this.description.charAt(0).toUpperCase() + this.description.slice(1);
  }
  next();
});

ProductSchema.methods.getAllCategories = function () {
  // Devuelve una combinación de la categoría principal y adicionales (si existen)
  return [this.category, ...this.additionalCategories];
};

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
