import mongoose from "mongoose";
import { CategoryModel } from "./category";

const ProductSchema = new mongoose.Schema(
  {
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
      default: true,
    }, //modificar outlet para poner el valor de 25% fijo
    outlet: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
);

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
  filters = {
    sort: "az",
    stock: [], // ['in-stock', 'out-of-stock']
    discount: [], // ['with-discount', 'without-discount']
    outlet: [], // ['outlet']
  },
  page = 1
) {
  const limit = 8;
  let query = this;
  const filterConditions = [];

  // Búsqueda
  if (search) {
    if (search.length > 3) {
      filterConditions.push({ $text: { $search: search } });
    } else {
      filterConditions.push({ name: { $regex: search, $options: "i" } });
    }
  }

  // Construcción de filtros
  const buildConditions = (values, valueMap) => {
    const conditions = [];
    values.forEach((value) => {
      if (valueMap[value]) conditions.push(valueMap[value]);
    });
    return conditions.length > 0 ? { $or: conditions } : null;
  };

  // Filtro de stock
  const stockFilter = buildConditions(filters.stock, {
    "in-stock": { stock: true },
    "out-of-stock": { stock: false },
  });
  if (stockFilter) filterConditions.push(stockFilter);

  // Filtro de descuentos
  const discountFilter = buildConditions(filters.discount, {
    "with-discount": { discount: { $gt: 0 } },
    "without-discount": { discount: 0 },
  });
  if (discountFilter) filterConditions.push(discountFilter);

  // Filtro de outlet
  if (filters.outlet.includes("outlet")) {
    filterConditions.push({ outlet: true });
  }

  // Aplicar todos los filtros combinados con AND
  if (filterConditions.length > 0) {
    query = query.find({ $and: filterConditions });
  }

  // Ordenamiento
  const sortOptions = {
    "low-to-high": { price: 1 },
    "high-to-low": { price: -1 },
    az: { name: 1 },
    za: { name: -1 },
  };
  query = query.sort(sortOptions[filters.sort] || { name: 1 });

  // Paginación y ejecución
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

ProductSchema.statics.byCategoryWithFilters = async function (
  categoryId,
  filter = "az",
  page = 1,
  limit = 10
) {
  const sortStage = {};

  if (filter === "az") sortStage.name = 1;
  else if (filter === "za") sortStage.name = -1;
  else if (filter === "low-to-high") sortStage.finalPrice = 1;
  else if (filter === "high-to-low") sortStage.finalPrice = -1;

  const matchStage = {
    $and: [
      {
        $or: [{ category: categoryId }, { additionalCategories: categoryId }],
      },
      { stock: true },
    ],
  };

  const pipeline = [
    { $match: matchStage },
    {
      $addFields: {
        finalPrice: {
          $cond: [{ $gt: ["$discount", 0] }, "$discount", "$price"],
        },
      },
    },
    { $sort: sortStage },
    {
      $facet: {
        products: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ];

  const result = await this.aggregate(pipeline).exec();

  const products = result[0].products;
  const total = result[0].total[0]?.count || 0;

  return {
    products,
    totalPages: Math.ceil(total / limit),
  };
};

export const ProductModel =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
