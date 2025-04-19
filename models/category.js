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

const autoPopulate = function () {
  this.populate("subcategories").populate({
    path: "products",
    options: { sort: { name: 1 } },
  });
};

categorySchema.pre("find", autoPopulate);
categorySchema.pre("findOne", autoPopulate);

categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    const trimmedName = this.name.trim();
    this.name = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
  }
  next();
});

categorySchema.methods.getParentName = async function () {
  if (!this.parentCategory) return null; // No tiene categoría padre

  const parent = await mongoose
    .model("Category")
    .findById(this.parentCategory)
    .select("name");
  return parent ? parent.name : null;
};

export const CategoryModel =
  mongoose?.models?.Category || mongoose.model("Category", categorySchema);
