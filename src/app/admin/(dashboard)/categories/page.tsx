import { getAllCategories } from "@/lib/data/categories";
import CategoriesAccordion from "./CategoriesAccordion";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="dashboard-content">
      <h1 className="mb-2 text-2xl font-bold">Categorías</h1>
      <CategoriesAccordion parentCategories={categories.filter((category) => !category.parentCategory)} />
    </div>
  );
}
