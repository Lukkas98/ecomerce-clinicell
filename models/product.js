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
  }, //modificar outlet para poner el valor de 25% fijo
  outlet: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    required: true,
  },
});

ProductSchema.index({ name: "text" });

ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    const trimmedName = this.name.trim();
    this.name = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
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

ProductSchema.query.byFilters = async function (
  search = "",
  filter = "az",
  page = 1
) {
  const limit = 8;
  let query = this;

  if (search) {
    if (search.length > 3) query = query.find({ $text: { $search: search } });
    else query = query.find({ name: { $regex: search, $options: "i" } });
  }

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

  // Obtener productos y total en paralelo
  const [products, total] = await Promise.all([
    query
      .clone()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    query.model.countDocuments(query.getFilter()),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
  };
};

ProductSchema.query.byCategoryWithFilters = async function (
  categoryId,
  filter = "az",
  page = 1,
  limit = 10
) {
  let sort = {};
  if (filter === "az") sort = { name: 1 };
  else if (filter === "za") sort = { name: -1 };
  else if (filter === "low-to-high") sort = { price: 1 };
  else if (filter === "high-to-low") sort = { price: -1 };

  const query = this.find({
    $and: [
      {
        $or: [{ category: categoryId }, { additionalCategories: categoryId }],
      },
      { stock: true },
    ],
  }).sort(sort);

  // Obtener productos y total en paralelo
  const [products, total] = await Promise.all([
    query
      .clone()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    query.model.countDocuments(query.getFilter()),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
  };
};

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
