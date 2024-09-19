import mongoose from "mongoose";
import { CategoryModel } from "./category";

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
    { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: [] },
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

ProductSchema.methods.getNamesCategories = async function () {
  const categoryIds = [this.category, ...this.additionalCategories];
  const categoriesNames = await CategoryModel.find({
    _id: { $in: categoryIds },
  }).select("name");

  return categoriesNames;
};

ProductSchema.query.byFilters = function (
  search = "",
  filter = "",
  page = 1,
  limit = 9
) {
  let query = this;
  if (search)
    query = query.find({
      name: { $regex: search, $options: "i" },
    });

  // Ordenar según la opción proporcionada
  switch (filter) {
    case "low-to-high":
      query = query.sort({ price: 1 });
      break;
    case "high-to-low":
      query = query.sort({ price: -1 });
      break;
    case "az":
      query = query.sort({ name: 1 });
      break;
    case "za":
      query = query.sort({ name: -1 });
      break;
    case "stock":
      query = query.find({ stock: true });
      break;
    case "-stock":
      query = query.find({ stock: false });
      break;
  }
  return query.skip((page - 1) * limit).limit(limit);
};

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
