"use server";
import { updateTag } from "next/cache";
import { ProductModel } from "@/models/productModel";
import connectDB from "../connectDB";
import { ProductDTO } from "../types/products";

export const updateProduct = async (id: string, data: Partial<ProductDTO>) => {
  await connectDB();
  await ProductModel.findByIdAndUpdate(id, data);
  updateTag("products");
};

export const createProduct = async (data: ProductDTO) => {
  await connectDB();
  await ProductModel.create(data);
  updateTag("products");
};

export const deleteProduct = async (id: string) => {
  await connectDB();
  await ProductModel.findByIdAndDelete(id);
  updateTag("products");
};
