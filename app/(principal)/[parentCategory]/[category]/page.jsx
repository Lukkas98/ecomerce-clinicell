import Category from "./components/category";
import { getProductsClient } from "@/lib/actions/products";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const { search, page, filter } = await searchParams;

  const data = await getProductsClient(
    page,
    filter,
    category === "Todos" ? null : category,
    10
  );

  return (
    <>
      <Category
        totalPages={data.totalPages}
        products={data.products}
        searchParams={searchParams}
      />
    </>
  );
}
