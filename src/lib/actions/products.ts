"use server";
import { updateTag } from "next/cache";
import { ProductModel } from "@/models/productModel";
import connectDB from "../connectDB";
import { ProductDTO } from "../types/products";
import { Types } from "mongoose";

type ProductDocument = Omit<ProductDTO, "categories"> & {
  categories: Types.ObjectId[];
};

const convertProductData = (
  data: Partial<ProductDTO>,
): Partial<ProductDocument> => {
  const converted: Partial<ProductDocument> = {
    ...data,
    categories: data.categories?.map((id) => new Types.ObjectId(id)),
  };
  return converted;
};

export const updateProduct = async (id: string, data: Partial<ProductDTO>) => {
  await connectDB();
  const convertedData = convertProductData(data);
  await ProductModel.findByIdAndUpdate(id, convertedData);
  updateTag("products");
  updateTag("categories");
};

export const createProduct = async (data: ProductDTO) => {
  await connectDB();
  const convertedData = convertProductData(data);
  await ProductModel.create(convertedData);
  updateTag("products");
  updateTag("categories");
};

export const deleteProduct = async (id: string) => {
  await connectDB();
  await ProductModel.findByIdAndDelete(id);
  updateTag("products");
  updateTag("categories");
};
