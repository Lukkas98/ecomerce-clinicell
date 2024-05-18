"use server";

import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import connectDB from "./ConectDB";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export const logAdmin = async (formData) => {
  const user = formData.get("user");
  const pass = formData.get("pass");

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASS;
  const url = process.env.URL_FRONT;
  const adminTrue = process.env.ADMIN_TRUE;

  const oneDay = 24 * 60 * 60 * 1000;
  if (user === adminUser && pass === adminPassword) {
    cookies().set("admin", adminTrue, {
      secure: true,
      expires: Date.now() + oneDay,
    });
    redirect(`${url}/admin/panel`);
  } else {
    cookies().set("admin", "false", {
      secure: true,
      expires: Date.now() + oneDay,
    });
    redirect(`${url}/admin`);
  }
};

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
  const products = await ProductModel.find({
    name: { $regex: `^${search}`, $options: "i" },
  });
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
