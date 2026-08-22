import { CategoryDTO } from "./categories";

export interface ProductImage {
  url?: string;
  publicId?: string;
}

export interface ProductDiscount {
  offert: boolean;
  outlet: boolean;
  DiscountPrice: number;
}

export interface ProductDTO {
  _id: string;
  name: string;
  price: number;
  description: string;
  categories: CategoryDTO["_id"][];
  stock: number;
  discount: ProductDiscount;
  images: ProductImage[];
}
