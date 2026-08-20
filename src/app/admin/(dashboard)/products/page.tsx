import { getAllProducts } from "@/lib/data/products";
import ProductsList from "./ProductsList";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="dashboard-content">
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Productos</h1>
      <ProductsList products={products} />
    </div>
  );
}
