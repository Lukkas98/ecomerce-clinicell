// import { getCategories } from "@/lib/actions/categories";
import Category from "./components/category";
import { getProductsClient } from "@/lib/actions/products";

// export async function generateStaticParams() {
//   const categories = await getCategories();
//   const parentCategories = categories.filter(
//     (cat) => cat.parentCategory === null
//   );

//   const paths = [];
//   for (const parent of parentCategories) {
//     const subcategories = categories.filter(
//       (cat) => String(cat.parentCategory) === String(parent._id) // o cat.parentCategory?.id, según tu DB
//     );
//     subcategories.forEach((subcat) => {
//       paths.push({
//         parentCategory: parent.name, // o parent.slug
//         category: subcat.name, // o subcat.slug
//       });
//     });
//   }
//   return paths;
// }

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
