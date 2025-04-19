import Category from "./components/category";
import { getProductsClient } from "@/lib/actions/products";

export default async function CategoryPage(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { category } = params;
  const { search, page, filter } = searchParams;

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
