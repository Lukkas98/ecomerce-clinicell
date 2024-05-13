"use server";

import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import connectDB from "./ConectDB";

export const getCategories = async () => {
  try {
    await connectDB();
    const categories = await CategoryModel.find({});

    if (!categories) {
      throw new Error("No hay Categorias");
    }

    return categories;
  } catch (error) {
    return error.message;
  }
};

export const getProducts = async () => {
  try {
    await connectDB();
    const products = await ProductModel.find({});

    if (!products) {
      throw new Error("No hay productos");
    }

    return products;
  } catch (error) {
    return error.message;
  }
};

export const searchProducts = async (search) => {
  await connectDB();
  const products = await ProductModel.find({ name: { $regex: `^${search}`, $options: 'i' } });
  return products;
};

export const getProduct = async (id) => {
  try {
    await connectDB();
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("El producto no existe");
    }

    return product;
  } catch (error) {
    return error.message;
  }
};

export const getCategoryId = async (id) => {
  try {
    await connectDB();
    const category = await CategoryModel.findById(id).populate("products");

    if (!category) {
      throw new Error(`La categoria id: %s no existe`, id);
    }

    return category;
  } catch (error) {
    return error.message;
  }
};

export const getCategoryName = async (name) => {
  try {
    await connectDB();
    const category = await CategoryModel.findOne({ name: name }).populate(
      "products"
    );

    if (!category) {
      throw new Error(`La categoria %s no existe`, name);
    }

    return category;
  } catch (error) {
    return error.message;
  }
};
