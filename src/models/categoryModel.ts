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
import { Product } from "./productModel";

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

  @prop({ ref: () => Product, type: () => Types.ObjectId, default: [] })
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
}

export type CategoryDocument = DocumentType<Category>;
export type CategoryModelType = ReturnModelType<typeof Category>;

export const CategoryModel: CategoryModelType =
  (mongoose?.models?.Category as CategoryModelType) ||
  getModelForClass(Category);
