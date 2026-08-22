import {
  prop,
  getModelForClass,
  pre,
  modelOptions,
  Ref,
  DocumentType,
  ReturnModelType,
  Severity,
} from "@typegoose/typegoose";
import mongoose, { Types } from "mongoose";
import { ProductModel } from "./productModel";
import type { Product } from "./productModel";
import type { CategoryDTO } from "@/lib/types/categories";
import type { ProductDTO } from "@/lib/types/products";

type LeanProduct = Omit<ProductDTO, "_id" | "categories"> & {
  _id: Types.ObjectId;
  categories?: Types.ObjectId[];
  name?: string;
  price?: number;
};

type LeanCategory = {
  _id: Types.ObjectId;
  name: string;
  parentCategory: LeanCategory | null;
  products: LeanProduct[];
  subcategories: LeanCategory[];
};

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: "categories",
  },
  options: { allowMixed: Severity.ALLOW },
})
@pre<Category>("save", function () {
  if (this.isModified("name")) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
})
export class Category {
  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ ref: () => Category, default: null })
  public parentCategory?: Ref<Category> | null;

  @prop({ ref: "Product", type: () => [Types.ObjectId], default: [] })
  public products!: Ref<Product>[];

  @prop({
    ref: () => Category,
    localField: "_id",
    foreignField: "parentCategory",
    justOne: false,
  })
  public subcategories?: Ref<Category>[];

  public static async getCategoryByName(
    this: ReturnModelType<typeof Category>,
    name: string,
  ) {
    const decodedName = decodeURIComponent(name);
    return this.findOne({ name: decodedName });
  }

  public static async getCategoriesWithStringIds(
    this: CategoryModelType,
  ): Promise<CategoryDTO[]> {
    const categories = (await this.find({})
      .populate("products")
      .populate("subcategories")
      .populate("parentCategory")
      .lean()) as LeanCategory[];

    const productIds = [...new Set(
      categories.flatMap((category) =>
        (Array.isArray(category.products) ? category.products : []).map((product) =>
          product && typeof product === "object" && "_id" in product
            ? String(product._id)
            : null,
        ),
      ),
    )].filter((id): id is string => Boolean(id));

    const products = productIds.length
      ? await ProductModel.find({ _id: { $in: productIds } }).lean()
      : [];

    const productLookup = new Map(
      (products as LeanProduct[]).map((product) => [product._id.toString(), product]),
    );

    return categories.map((category) =>
      this.transformCategoryToDTO(category, productLookup),
    );
  }

  private static transformCategoryToDTO(
    category: LeanCategory,
    productLookup = new Map<string, LeanProduct>(),
  ): CategoryDTO {
    return {
      _id: category._id.toString(),
      name: category.name,
      parentCategory: category.parentCategory
        ? this.transformCategoryToDTO(category.parentCategory, productLookup)
        : null,
      products: (Array.isArray(category.products) ? category.products : []).map(
        (p: LeanProduct) => {
          const actualProduct =
            p && typeof p === "object" && "_id" in p
              ? productLookup.get(String(p._id)) ?? p
              : p;

          const safeProduct = {
            _id: actualProduct?._id ?? p?._id,
            name: actualProduct?.name ?? p?.name ?? "",
            price: actualProduct?.price ?? p?.price ?? 0,
            description: actualProduct?.description ?? p?.description ?? "",
            categories: (actualProduct?.categories ?? p?.categories ?? []).map(
              (id) => id.toString(),
            ),
            stock: actualProduct?.stock ?? p?.stock ?? 0,
            outlet: actualProduct?.outlet ?? p?.outlet ?? { isActive: false, price: 0 },
            offert: actualProduct?.offert ?? p?.offert ?? 0,
            images: actualProduct?.images ?? p?.images ?? [],
            calculatedPrice:
              actualProduct?.calculatedPrice ??
              p?.calculatedPrice ??
              (actualProduct?.outlet?.isActive
                ? actualProduct.outlet.price
                : actualProduct?.offert && actualProduct.offert > 0
                  ? actualProduct.offert
                  : actualProduct?.price ?? 0),
          };

          return {
            _id: safeProduct._id.toString(),
            name: safeProduct.name,
            price: safeProduct.price,
            description: safeProduct.description,
            categories: safeProduct.categories,
            stock: safeProduct.stock,
            outlet: safeProduct.outlet,
            offert: safeProduct.offert,
            images: safeProduct.images,
            calculatedPrice: safeProduct.calculatedPrice,
          };
        },
      ),
      subcategories: (
        Array.isArray(category.subcategories) ? category.subcategories : []
      ).map((s: LeanCategory) => this.transformCategoryToDTO(s, productLookup)),
    };
  }
}

export type CategoryDocument = DocumentType<Category>;
export type CategoryModelType = ReturnModelType<typeof Category>;

export const CategoryModel: CategoryModelType =
  (mongoose?.models?.Category as CategoryModelType) ||
  getModelForClass(Category);
