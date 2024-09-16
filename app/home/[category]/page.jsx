import Category from "./components/category";
import { getProducts } from "@/lib/actions/products";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const { search, page, filter } = searchParams;

  const data = await getProducts(
    search,
    page,
    filter,
    category === "Todos" ? null : category
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
