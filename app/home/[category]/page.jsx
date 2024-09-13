import Category from "./components/category";
import {
  getProducts,
  getTotalPages,
  searchProducts,
} from "@/lib/actions/products";
import { getCategoryName } from "@/lib/actions/categories";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const { search, page, filter } = searchParams;

  if (search) {
    const products = await searchProducts(search, false, page, filter);
    const totalPages = await getTotalPages(search);
    return (
      <>
        <Category
          totalPages={totalPages}
          products={products}
          searchParams={searchParams}
        />
      </>
    );
  }

  if (category === "Todos") {
    const products = await getProducts(page, false, filter);
    const totalPages = await getTotalPages();
    return (
      <>
        <Category
          totalPages={totalPages}
          products={products}
          searchParams={searchParams}
        />
      </>
    );
  }

  const categoryObj = await getCategoryName(decodeURIComponent(category));
  const totalPages = await getTotalPages(null, categoryObj._id);

  const limit = 9;
  const filterProducts = await categoryObj.getSortedProducts(
    filter,
    page,
    limit
  );

  return (
    <>
      <Category
        totalPages={totalPages}
        products={filterProducts}
        searchParams={searchParams}
      />
    </>
  );
}
