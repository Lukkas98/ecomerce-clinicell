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
  __v: number;
  name: string;
  price: number;
  description: string;
  categories: string[];
  stock: number;
  outlet: ProductOutlet;
  offert: number;
  images: ProductImage[];
  calculatedPrice: number;
}
