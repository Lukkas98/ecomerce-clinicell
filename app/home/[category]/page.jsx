import Category from "./components/category";
import {
  getProducts,
  getTotalPages,
  searchProducts,
} from "@/lib/actions/products";
import { getCategoryName } from "@/lib/actions/categories";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const { search, page } = searchParams;

  if (search) {
    const products = await searchProducts(search, false, page);
    const totalPages = await getTotalPages(search);
    return (
      <>
        <Category
          totalPages={totalPages}
          products={products}
          searchParams={searchParams}
        />
        {/* {console.log("totalPages search:", totalPages)} */}
      </>
    );
  }

  if (category === "Todos") {
    const products = await getProducts(page);
    const totalPages = await getTotalPages();
    return (
      <>
        <Category
          totalPages={totalPages}
          products={products}
          searchParams={searchParams}
        />
        {/* {console.log("totalPages todos: ", totalPages)} */}
      </>
    );
  }

  const categoryObj = await getCategoryName(decodeURIComponent(category), page);
  const totalPages = await getTotalPages(null, categoryObj._id);

  const limit = 9;
  const skip = (page - 1) * limit;

  return (
    <>
      <Category
        totalPages={totalPages}
        products={categoryObj.products.slice(skip, skip + limit)}
        searchParams={searchParams}
      />
      {/* {console.log("totalPages category: ", totalPages)} */}
    </>
  );
}
