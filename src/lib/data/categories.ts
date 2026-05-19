import { CategoryModel } from "@/models/categoryModel";
import connectDB from "../connectDB";
import { cacheTag } from "next/cache";

export const getAllCategories = async () => {
  "use cache";
  cacheTag("products");
  await connectDB();
  const categories = await CategoryModel.find({});

  return categories.map((c) => ({
    ...c,
    _id: c._id.toString(),
  }));
};
