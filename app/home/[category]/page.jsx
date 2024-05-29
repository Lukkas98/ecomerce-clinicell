import Category from "@/components/category";
import { getCategoryName, getProducts, searchProducts } from "@/lib/actions";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const { search } = searchParams

  if (search) {
    const products = await searchProducts(search)
    return (
      <>
        <Category products={products} searchParams={searchParams} />
      </>
    );
  }

  if (category === "Todos") {
    const products = await getProducts()
    return (
      <>
        <Category products={products} searchParams={searchParams} />
      </>
    );
  }

  const categoryObj = await getCategoryName(category);

  return (
    <>
      <Category products={categoryObj.products} searchParams={searchParams} />
    </>
  );
}
