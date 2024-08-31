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
    ref: "Category",
    required: true,
  },
  stock: {
    type: Boolean,
    require: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  if (this.isModified("description")) {
    this.description =
      this.description.charAt(0).toUpperCase() +
      this.description.slice(1).toLowerCase();
  }
  next();
});

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", productSchema);
