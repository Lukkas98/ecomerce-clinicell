import OffertsPage from "@/components/(extras)/ofertas";
import OutletPage from "@/components/(extras)/outlet";
import { getCategoryName } from "@/lib/actions/categories";
import Link from "next/link";

export default async function ParentCategoryPage({ params, searchParams }) {
  const { parentCategory } = await params;
  const category = await getCategoryName(decodeURIComponent(parentCategory));

  if (parentCategory === "ofertas")
    return <OffertsPage searchParams={searchParams} />;

  if (parentCategory === "outlet")
    return <OutletPage searchParams={searchParams} />;

  return (
    <div className=" bg-gray-900 m-5">
      {/* Título de la categoría principal */}
      <h2 className="text-3xl font-bold text-white mb-7">
        {decodeURIComponent(parentCategory)}
      </h2>

      {/* Contenedor de las subcategorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.subcategories?.map((subcategory) => (
          <Link
            href={`/${category.name}/${subcategory.name}`}
            key={subcategory._id}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow hover:bg-gray-700 cursor-pointer transition"
          >
            <p className="text-lg font-medium text-gray-300">
              {subcategory.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
