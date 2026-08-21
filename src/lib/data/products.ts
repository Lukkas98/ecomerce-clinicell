import { ProductModel } from "@/models/productModel";
import connectDB from "../connectDB";
import { cacheTag } from "next/cache";
import { getCalculatedPrice } from "../utils/products";
import { ProductDTO } from "../types/products";
import type { FilterOptions } from "@/models/productModel";

export type ProductSearchFilters = Pick<FilterOptions, "search" | "filters">;

type ProductRecord = {
  _id?: { toString(): string };
  name: string;
  price: number;
  description: string;
  categories?: unknown[];
  stock?: number;
  outlet?: { isActive: boolean; price: number };
  offert?: number;
  images?: ProductDTO["images"];
};

function serializeProduct(product: ProductRecord): ProductDTO {
  if (!product._id) {
    throw new Error("Product query returned a product without an id");
  }

  const outlet = product.outlet ?? { isActive: false, price: 0 };
  const offert = product.offert ?? 0;

  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    description: product.description,
    categories: (product.categories ?? []).map(String),
    outlet,
    offert,
    images: product.images ?? [],
    stock: product.stock ?? 0,
    calculatedPrice: getCalculatedPrice({
      price: product.price,
      offert,
      outlet,
    }),
  };
}

export const getAllProducts = async (): Promise<ProductDTO[]> => {
  "use cache";
  cacheTag("products");

  await connectDB();
  const products = await ProductModel.find({}).lean();

  //serialize products for cache
  return products.map((product) => serializeProduct(product));
};

export const getFilteredProducts = async (
  filters: ProductSearchFilters,
  page: number,
): Promise<{ products: ProductDTO[]; totalProducts: number }> => {
  await connectDB();

  const result = await ProductModel.superFilter({
    ...filters,
    page,
    limit: 15,
  });

  return {
    products: result.products.map((product) => serializeProduct(product)),
    totalProducts: result.totalProducts,
  };
};
