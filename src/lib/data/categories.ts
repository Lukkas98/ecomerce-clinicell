import { CategoryModel } from "@/models/categoryModel";
import type { CategoryDTO } from "../types/categories";
import connectDB from "../connectDB";
import { cacheTag } from "next/cache";

export const getAllCategories = async (): Promise<CategoryDTO[]> => {
  "use cache";
  cacheTag("categories");
  await connectDB();
  return CategoryModel.getCategoriesWithStringIds();
};
