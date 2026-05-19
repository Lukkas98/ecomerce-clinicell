import { CategoryDTO } from "./categories";

export interface ProductImage {
  url?: string;
  publicId?: string;
}

export interface ProductOutlet {
  isActive: boolean;
  price: number;
}

export interface ProductDTO {
  _id: string;
  name: string;
  price: number;
  description: string;
  categories: CategoryDTO["_id"][];
  stock: number;
  outlet: ProductOutlet;
  offert: number;
  images: ProductImage[];
  calculatedPrice: number;
}
