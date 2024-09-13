import Category from "./components/category";
import {
  getProducts,
  getTotalPages,
  searchProducts,
} from "@/lib/actions/products";
import { getCategoryName } from "@/lib/actions/categories";
import { useMemo } from "react";

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

function filterCategory(products, filter) {
  let sorted = [...products]; // Hacemos una copia para no mutar el original
  if (filter === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
  } else if (filter === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
  } else if (filter === "high-to-low") {
    sorted.sort((a, b) => b.price - a.price); // Precio Mayor a Menor
  } else if (filter === "low-to-high") {
    sorted.sort((a, b) => a.price - b.price); // Precio Menor a Mayor
  }
  return sorted;
}
