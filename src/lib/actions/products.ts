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

export type CreateProductState = {
  ok: boolean;
  message: string;
};

export async function createProductFromForm(
  _previousState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  const offert = Number(formData.get("offert") ?? 0);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const outlet = formData.get("outlet") === "on";

  await connectDB();
  await ProductModel.create({
    name,
    description,
    price,
    stock,
    offert: outlet ? 0 : offert,
    outlet: { isActive: outlet, price: 0 },
    images: imageUrl ? [{ url: imageUrl }] : [],
    categories: [],
  });

  updateTag("products");
  updateTag("categories");

  return { ok: true, message: "Producto creado correctamente." };
}

export const deleteProduct = async (id: string) => {
  await connectDB();
  await ProductModel.findByIdAndDelete(id);
  updateTag("products");
  updateTag("categories");
};
