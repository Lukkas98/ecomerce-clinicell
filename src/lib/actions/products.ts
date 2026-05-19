"use server";
import { updateTag } from "next/cache";
import { ProductModel } from "@/models/productModel";
import connectDB from "../connectDB";
import { ProductDTO } from "../types/products";
import { Types } from "mongoose";

const convertProductData = (
  data: Partial<ProductDTO>,
): Record<string, unknown> => {
  const converted: Record<string, unknown> = { ...data };
  if (data.categories) {
    converted.categories = data.categories.map((id) => new Types.ObjectId(id));
  }
  return converted;
};

export const updateProduct = async (id: string, data: Partial<ProductDTO>) => {
  await connectDB();
  const convertedData = convertProductData(data);
  await ProductModel.findByIdAndUpdate(id, convertedData);
  updateTag("products");
};

export const createProduct = async (data: ProductDTO) => {
  await connectDB();
  const convertedData = convertProductData(data);
  await ProductModel.create(convertedData);
  updateTag("products");
};

export const deleteProduct = async (id: string) => {
  await connectDB();
  await ProductModel.findByIdAndDelete(id);
  updateTag("products");
};
