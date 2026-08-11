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
import type { Product } from "./productModel";
import type { CategoryDTO } from "@/lib/types/categories";
import type { ProductDTO } from "@/lib/types/products";

type LeanProduct = Omit<ProductDTO, "_id" | "categories"> & {
  _id: Types.ObjectId;
  categories: Types.ObjectId[];
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

  @prop({ ref: "Product", type: () => Types.ObjectId, default: [] })
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

    return categories.map((c) => this.transformCategoryToDTO(c));
  }

  private static transformCategoryToDTO(category: LeanCategory): CategoryDTO {
    return {
      _id: category._id.toString(),
      name: category.name,
      parentCategory: category.parentCategory
        ? this.transformCategoryToDTO(category.parentCategory)
        : null,
      products: category.products.map((p: LeanProduct) => ({
        _id: p._id.toString(),
        name: p.name,
        price: p.price,
        description: p.description,
        categories: p.categories.map((id) => id.toString()),
        stock: p.stock,
        outlet: p.outlet,
        offert: p.offert,
        images: p.images,
        calculatedPrice: p.calculatedPrice,
      })),
      subcategories: category.subcategories.map((s: LeanCategory) =>
        this.transformCategoryToDTO(s),
      ),
    };
  }
}

export type CategoryDocument = DocumentType<Category>;
export type CategoryModelType = ReturnModelType<typeof Category>;

export const CategoryModel: CategoryModelType =
  (mongoose?.models?.Category as CategoryModelType) ||
  getModelForClass(Category);
