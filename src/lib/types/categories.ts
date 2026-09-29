import { ProductDTO } from "./products";

export interface CategoryDTO {  
    _id: string;
    name: string;
    parentCategory: CategoryDTO | null;
    products: ProductDTO[];
    subcategories: CategoryDTO[];
}