import { ProductModel } from "@/models/productModel";
import connectDB from "../connectDB";
import { cacheTag } from "next/cache";
import { getCalculatedPrice } from "../utils/products";
import { ProductDTO } from "../types/products";

export const getAllProducts = async (): Promise<ProductDTO[]> => {
  "use cache";
  cacheTag("products");

  await connectDB();
  const products = await ProductModel.find({}).lean();

  //serialize products for cache
  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
    categories: p.categories.map((c) => c!.toString()),
    calculatedPrice: getCalculatedPrice(p),
  }));
};
