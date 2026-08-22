import { ProductModel } from "@/models/productModel";
import connectDB from "../connectDB";
import { cacheTag } from "next/cache";
import { getProductDisplayPrice } from "../utils/products";
import { ProductDTO } from "../types/products";
import type { FilterOptions } from "@/models/productModel";

export type ProductSearchFilters = Pick<FilterOptions, "search" | "filters">;

type ProductRecord = {
  _id?: { toString(): string };
  name?: string;
  price?: number;
  description?: string;
  categories?: unknown[];
  stock?: number;
  discount?: {
    offert?: boolean;
    outlet?: boolean;
    DiscountPrice?: number;
  };
  images?: ProductDTO["images"];
};

function serializeProduct(product: ProductRecord): ProductDTO {
  if (!product._id) {
    throw new Error("Product query returned a product without an id");
  }

  const discount = {
    offert: Boolean(product.discount?.offert ?? false),
    outlet: Boolean(product.discount?.outlet ?? false),
    DiscountPrice: Number(product.discount?.DiscountPrice ?? 0),
  };

  if (discount.offert && discount.outlet) {
    discount.outlet = false;
  }

  if (!discount.offert && !discount.outlet) {
    discount.DiscountPrice = 0;
  }

  return {
    _id: product._id.toString(),
    name: product.name ?? "",
    price: product.price ?? 0,
    description: product.description ?? "",
    categories: (product.categories ?? []).map(String),
    discount,
    images: product.images ?? [],
    stock: product.stock ?? 0,
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

export const getProductById = async (
  id: string,
): Promise<ProductDTO | null> => {
  await connectDB();
  const product = await ProductModel.findById(id).lean();

  return product ? serializeProduct(product) : null;
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

export { getProductDisplayPrice };
