import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }]
});

export const CategoryModel =
  mongoose?.models?.Category || mongoose.model("Category", categorySchema);
