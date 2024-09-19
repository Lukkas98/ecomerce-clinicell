import LinkHeader from "@/components/(header)/linkHeader";
import { getCategories } from "@/lib/actions/categories";

export default async function DesktopNav() {
  const categories = await getCategories();

  return (
    <nav className="bg-gray-800 py-2 mb-5">
      <div className="container mx-auto px-4 grid gap-3">
        <LinkHeader
          categoryName={"Todos"}
          className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 whitespace-nowrap w-full overflow-hidden"
        />
        {categories?.map((category) => (
          <LinkHeader
            key={category._id}
            categoryName={category.name}
            className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 whitespace-nowrap w-full overflow-hidden"
          />
        ))}
      </div>
    </nav>
  );
}
