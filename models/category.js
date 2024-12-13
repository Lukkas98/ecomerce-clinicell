import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null, // Si es null, es una categoría principal
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

categorySchema.pre("find", function () {
  this.populate("subcategories");
});

categorySchema.pre("findOne", function () {
  this.populate("subcategories");
});

categorySchema.methods.getParentName = async function () {
  if (!this.parentCategory) {
    return null; // No tiene categoría padre
  }

  const parent = await mongoose
    .model("Category")
    .findById(this.parentCategory)
    .select("name");
  return parent ? parent.name : null;
};

categorySchema.methods.getSortedProducts = async function (
  filter,
  page = 1,
  limit = 10
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
  const products = await mongoose
    .model("Product")
    .find({
      _id: { $in: this.products },
    })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  return products;
};

export const CategoryModel =
  mongoose?.models?.Category || mongoose.model("Category", categorySchema);
