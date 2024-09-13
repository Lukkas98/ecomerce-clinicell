import mongoose from "mongoose";
import { ProductModel } from "./product";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

categorySchema.methods.getSortedProducts = async function (
  filter,
  page = 1,
  limit = 9
) {
  const skip = (page - 1) * limit;
  let sort = {};
  if (filter === "az") {
    sort = { name: 1 };
  } else if (filter === "za") {
    sort = { name: -1 };
  } else if (filter === "low-to-high") {
    sort = { price: 1 };
  } else if (filter === "high-to-low") {
    sort = { price: -1 };
  }
  const products = await ProductModel.find({
    _id: { $in: this.products },
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  return products;
};

export const CategoryModel =
  mongoose?.models?.Category || mongoose.model("Category", categorySchema);
