import {
  prop,
  getModelForClass,
  pre,
  modelOptions,
  Ref,
  DocumentType,
  ReturnModelType,
  plugin,
  Severity,
} from "@typegoose/typegoose";
import paginate from "mongoose-paginate-v2";
import mongoose, { Types, PaginateModel, QueryFilter } from "mongoose";
import { Category } from "./categoryModel";

class ProductImage {
  @prop() public url?: string;
  @prop() public publicId?: string;
}

class Outlet {
  @prop({ default: false }) public isActive!: boolean;
  @prop({ default: 0 }) public price!: number;
}

export type FilterSort = "az" | "za" | "low-to-high" | "high-to-low";
export interface FilterOptions {
  _id?: Types.ObjectId | string;
  categoryId?: Types.ObjectId | string;
  search?: string;
  filters?: {
    sort?: FilterSort;
    stock?: Array<"in-stock" | "out-of-stock">;
    offert?: Array<"with-offer" | "without-offer">;
    outlet?: boolean;
  };
  page?: number;
  limit?: number;
}

type PaginateSort = string | Record<string, 1 | -1>;
const SORT_MAP: Record<FilterSort, PaginateSort> = {
  az: { name: 1 },
  za: { name: -1 },
  "low-to-high": { price: 1 },
  "high-to-low": { price: -1 },
};

@plugin(paginate)
@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "products",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: { allowMixed: Severity.ALLOW },
})
@pre<Product>("save", function () {
  if (this.isModified("name")) {
    this.name = this.name.trim().replace(/^\w/, (c) => c.toUpperCase());
  }
  if (this.isModified("description")) {
    this.description =
      this.description.charAt(0).toUpperCase() + this.description.slice(1);
  }
  if (this.isModified("outlet") || this.isModified("price")) {
    this.outlet.price = this.outlet.isActive ? this.price * 0.75 : 0;
  }
})
export class Product {
  @prop({ required: true, trim: true }) public name!: string;
  @prop({ required: true, min: 0 }) public price!: number;
  @prop({ required: true }) public description!: string;

  @prop({ ref: () => Category, type: () => [Types.ObjectId], default: [] })
  public categories!: Ref<Category>[];

  @prop({ default: 0, min: 0 }) public stock!: number;
  @prop({ _id: false, default: () => ({ isActive: false, price: 0 }) })
  public outlet!: Outlet;
  @prop({ default: 0 }) public offert!: number;
  @prop({ type: () => [ProductImage], default: [] })
  public images!: ProductImage[];

  public get calculatedPrice() {
    if (this.outlet.isActive) return this.outlet.price;
    return this.offert > 0 ? this.offert : this.price;
  }

  public static async superFilter(this: ProductModelType, opts: FilterOptions) {
    const { categoryId, search, filters = {}, page = 1, limit = 10 } = opts;
    const { sort = "az", stock, offert, outlet } = filters;

    const query: QueryFilter<Product> = {};

    if (categoryId) query.categories = new Types.ObjectId(String(categoryId));
    if (search) query.name = { $regex: search, $options: "i" };
    if (typeof outlet === "boolean") query["outlet.isActive"] = outlet;

    const conditions: QueryFilter<Product>[] = [];

    if (stock?.includes("in-stock")) conditions.push({ stock: { $gt: 0 } });
    if (stock?.includes("out-of-stock")) conditions.push({ stock: 0 });

    if (offert?.includes("with-offer")) conditions.push({ offert: { $gt: 0 } });
    if (offert?.includes("without-offer")) {
      conditions.push({ $or: [{ offert: 0 }, { offert: { $exists: false } }] });
    }

    if (conditions.length > 0) query.$and = conditions;

    const result = await this.paginate(query, {
      page,
      limit,
      sort: SORT_MAP[sort] || SORT_MAP.az,
      lean: true,
    });

    return {
      products: result.docs,
      totalPages: result.totalPages,
      totalProducts: result.totalDocs,
      nextPage: result.hasNextPage,
      prevPage: result.hasPrevPage,
    };
  }
}

export type ProductDocument = DocumentType<Product>;
export type ProductModelType = ReturnModelType<typeof Product> &
  PaginateModel<Product>;

export const ProductModel =
  (mongoose.models?.Product as ProductModelType) ||
  (getModelForClass(Product) as ProductModelType);
