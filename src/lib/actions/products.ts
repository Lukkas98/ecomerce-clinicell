"use server";
import { updateTag } from "next/cache";
import { ProductModel } from "@/models/productModel";
import { CategoryModel } from "@/models/categoryModel";
import connectDB from "../connectDB";
import { ProductDTO, ProductDiscount, ProductImage } from "../types/products";
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

function parseImages(formData: FormData): ProductImage[] {
  const value = String(formData.get("images") ?? "[]");
  const images = JSON.parse(value) as unknown;

  if (!Array.isArray(images)) {
    throw new Error("El formato de las imágenes no es válido");
  }

  return images.filter(
    (image): image is ProductImage =>
      typeof image === "object" &&
      image !== null &&
      typeof (image as ProductImage).url === "string",
  );
}

function parseDiscount(formData: FormData): ProductDiscount {
  const offert =
    formData.get("discountOffert") === "on" ||
    formData.get("discountOffert") === "true" ||
    formData.get("discountOffert") === "1";
  const outlet =
    formData.get("discountOutlet") === "on" ||
    formData.get("discountOutlet") === "true" ||
    formData.get("discountOutlet") === "1";

  const discount: ProductDiscount = {
    offert,
    outlet,
    DiscountPrice: Number(formData.get("discountPrice") ?? 0),
  };

  if (discount.offert && discount.outlet) {
    discount.outlet = false;
  }

  if (!discount.offert && !discount.outlet) {
    discount.DiscountPrice = 0;
  }

  return discount;
}

function parseProductForm(formData: FormData): Omit<ProductDTO, "_id"> {
  const categories = formData.getAll("categories").map(String);

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    stock: Number(formData.get("stock") ?? 0),
    discount: parseDiscount(formData),
    categories,
    images: parseImages(formData),
  };
}

export async function createProductFromForm(
  _previousState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const data = parseProductForm(formData);

  await connectDB();
  const product = await ProductModel.create(convertProductData(data));
  await CategoryModel.updateMany(
    { _id: { $in: data.categories } },
    { $addToSet: { products: product._id } },
  );

  updateTag("products");
  updateTag("categories");

  return { ok: true, message: "Producto creado correctamente." };
}

export async function updateProductFromForm(
  _previousState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const id = String(formData.get("productId") ?? "");
  if (!id) return { ok: false, message: "Falta el identificador del producto." };

  const data = parseProductForm(formData);
  await connectDB();
  const currentProduct = await ProductModel.findById(id).select("categories");
  if (!currentProduct) {
    return { ok: false, message: "El producto no existe." };
  }

  await ProductModel.findByIdAndUpdate(id, convertProductData(data), {
    new: true,
    runValidators: true,
  });
  await CategoryModel.updateMany(
    { products: id, _id: { $nin: data.categories } },
    { $pull: { products: id } },
  );
  await CategoryModel.updateMany(
    { _id: { $in: data.categories } },
    { $addToSet: { products: id } },
  );
  updateTag("products");
  updateTag("categories");

  return { ok: true, message: "Producto actualizado correctamente." };
}

export const deleteProduct = async (id: string) => {
  await connectDB();
  await ProductModel.findByIdAndDelete(id);
  updateTag("products");
  updateTag("categories");
};
