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

// Convert category data to save it in MongoDB
const convertCategoryData = (data: CategoryDTO): CategoryDocument => ({
  name: data.name,
  parentCategory: data.parentCategory
    ? new Types.ObjectId(data.parentCategory._id)
    : null,
  products: data.products.map((p) => new Types.ObjectId(p._id)),
});

export const createCategory = async (
  prevState: { message: string; ok: boolean } | null,
  formData: FormData,
) => {
  const name =
    (formData.get("name")?.toString() ?? "Categoría harcodeada").trim() ||
    "Categoría harcodeada";

  const categoryData: CategoryDTO = {
    _id: "",
    name,
    parentCategory: null,
    products: [],
    subcategories: [],
  };

  await connectDB();
  const converted = convertCategoryData(categoryData);
  await CategoryModel.create(converted);
  updateTag("categories");

  return {
    message: `Categoría "${name}" creada correctamente.`,
    ok: true,
  };
};

export const createCategoryDirect = async (name: string, parentId?: string) => {
  await connectDB();
  await CategoryModel.create({
    name: name.trim(),
    parentCategory: parentId ? new Types.ObjectId(parentId) : null,
    products: [],
  });
  updateTag("categories");
};

export const updateCategoryName = async (id: string, name: string) => {
  await connectDB();
  await CategoryModel.findByIdAndUpdate(id, { name: name.trim() });
  updateTag("categories");
};

export const deleteCategory = async (id: string) => {
  await connectDB();
  await CategoryModel.deleteMany({
    $or: [{ _id: new Types.ObjectId(id) }, { parentCategory: new Types.ObjectId(id) }],
  });
  updateTag("categories");
};
