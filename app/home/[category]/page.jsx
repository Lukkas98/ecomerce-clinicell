import Category from "@/components/category";
import { getCategoryName, getProducts } from "@/lib/actions";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = params;

  if (category === "all") {
    const products = await getProducts()
    return (
      <>
        <Category products={products} searchParams={"searchParams"} />
      </>
    );
  }

  const categoryObj = await getCategoryName(category);

  return (
    <>
      <Category products={categoryObj.products} searchParams={"searchParams"} />
    </>
  );
}
