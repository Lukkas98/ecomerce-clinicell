"use server";
import { CategoryModel } from "@/models/categoryModel";
import { ProductModel } from "@/models/productModel";
import { updateTag } from "next/cache";
import { Types } from "mongoose";
import { verifySession } from "../auth";
import connectDB from "../connectDB";

export const createCategory = async (name: string, parentId?: string) => {
  if (!(await verifySession())) {
    throw new Error("No eres administrador.");
  }

  await connectDB();
  await CategoryModel.create({
    name: name.trim(),
    parentCategory: parentId ? new Types.ObjectId(parentId) : null,
    products: [],
  });
  updateTag("categories");
};

export const updateCategoryName = async (id: string, name: string) => {
  if (!(await verifySession())) {
    throw new Error("No eres administrador.");
  }

  await connectDB();
  await CategoryModel.findByIdAndUpdate(id, { name: name.trim() });
  updateTag("categories");
};

export const deleteCategory = async (id: string) => {
  if (!(await verifySession())) {
    throw new Error("No eres administrador.");
  }

  await connectDB();
  const categoryObjectId = new Types.ObjectId(id);

  const category = await CategoryModel.findById(id)
    .populate("subcategories")
    .populate("products")
    .lean();

  if (!category) {
    throw new Error("La categoría no existe.");
  }

  const hasSubcategories = Array.isArray(category.subcategories)
    ? category.subcategories.length > 0
    : false;

  const hasProducts = Array.isArray(category.products)
    ? category.products.length > 0
    : false;

  if (hasSubcategories || hasProducts) {
    if (!category.parentCategory) {
      throw new Error(
        "La categoría principal no se puede eliminar si tiene subcategorías o productos.",
      );
    }
    if (hasProducts) {
      await ProductModel.updateMany(
        { categories: categoryObjectId },
        { $pull: { categories: categoryObjectId } },
      );
    }
    await CategoryModel.findByIdAndDelete(id);
    updateTag("categories");
    updateTag("products");
    return;
  }

  await ProductModel.updateMany(
    { categories: categoryObjectId },
    { $pull: { categories: categoryObjectId } },
  );

  await CategoryModel.deleteMany({
    $or: [
      { _id: categoryObjectId },
      { parentCategory: categoryObjectId },
    ],
  });

  updateTag("categories");
  updateTag("products");
};
