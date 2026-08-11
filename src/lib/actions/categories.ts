"use server";
import { CategoryModel } from "@/models/categoryModel";
import { updateTag } from "next/cache";
import { CategoryDTO } from "../types/categories";
import { Types } from "mongoose";
import connectDB from "../connectDB";

type CategoryDocument = Omit<
  CategoryDTO,
  "_id" | "parentCategory" | "subcategories" | "products"
> & {
  parentCategory: Types.ObjectId | null;
  products: Types.ObjectId[];
};

const convertCategoryData = (data: CategoryDTO): CategoryDocument => ({
  name: data.name,
  parentCategory: data.parentCategory
    ? new Types.ObjectId(data.parentCategory._id)
    : null,
  products: data.products.map((p) => new Types.ObjectId(p._id)),
});

export const createCategory = async (categoryData: CategoryDTO) => {
  await connectDB();
  const converted = convertCategoryData(categoryData);
  await CategoryModel.create(converted);
  updateTag("categories");
};
