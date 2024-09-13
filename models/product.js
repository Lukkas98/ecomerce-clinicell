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

ProductSchema.methods.getAllCategories = function () {
  // Devuelve una combinación de la categoría principal y adicionales (si existen)
  return [this.category, ...this.additionalCategories];
};

productSchema.query.byFilters = function (
  search = "",
  filter = "",
  page = 1,
  limit = 9,
  isAdmin = false //cambiar en un futuro
) {
  if (isAdmin) return this.find({});

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
  }
  return query.skip((page - 1) * limit).limit(limit);
};

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
