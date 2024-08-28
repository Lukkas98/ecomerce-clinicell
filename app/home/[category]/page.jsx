import Category from "@/components/category";
import { getProducts, searchProducts } from "@/lib/actions/products";
import { getCategoryName } from "@/lib/actions/categories";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;
  const { search } = searchParams;

  if (search) {
    const products = await searchProducts(search);
    return (
      <>
        <Category products={products} searchParams={searchParams} />
      </>
    );
  }

  if (category === "Todos") {
    const products = await getProducts();
    return (
      <>
        <Category products={products} searchParams={searchParams} />
      </>
    );
  }

  const categoryObj = await getCategoryName(decodeURIComponent(category));

  return (
    <>
      <Category products={categoryObj.products} searchParams={searchParams} />
    </>
  );
}
