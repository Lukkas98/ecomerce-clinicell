import OffertsPage from "@/components/(extras)/ofertas";
import OutletPage from "@/components/(extras)/outlet";
import { getCategoryName } from "@/lib/actions/categories";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ParentCategoryPage({ params, searchParams }) {
  const { parentCategory } = await params;
  const category = await getCategoryName(decodeURIComponent(parentCategory));

  if (parentCategory === "ofertas")
    return <OffertsPage searchParams={searchParams} />;

  if (parentCategory === "outlet")
    return <OutletPage searchParams={searchParams} />;

  const { subcategories, name } = category;

  if (!subcategories) return notFound();

  return (
    <div className="m-5 bg-gray-900">
      {/* Título de la categoría principal */}
      <h2 className="mb-7 text-3xl font-bold text-white">
        {decodeURIComponent(parentCategory)}
      </h2>

      {/* Contenedor de las subcategorías */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {category.subcategories?.map((subcategory) => (
          <Link
            href={`/${name}/${subcategory.name}`}
            key={subcategory._id}
            className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 shadow transition hover:bg-gray-700"
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
