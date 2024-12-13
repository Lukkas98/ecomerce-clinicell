import { getCategories } from "@/lib/actions/categories";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MegaMenu() {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fecthCategories = async () => {
      const response = await getCategories(true);
      setCategories(response);
    };
    fecthCategories();
  }, []);

  return (
    <div className="relative" onMouseEnter={() => setMegaMenuOpen(true)}>
      <button className="text-sm hover:text-blue-500 flex items-center gap-1">
        Categorías
        <ChevronDownIcon width={20} height={20} />
      </button>
      {megaMenuOpen && (
        <div
          onClick={() => setMegaMenuOpen(false)}
          onMouseLeave={() => setMegaMenuOpen(false)}
          className="absolute -left-40 mt-2 bg-gray-800 w-72 rounded-lg shadow-lg z-10 p-4"
        >
          <div className="grid grid-cols-2 gap-6">
            {categories
              ?.filter((cat) => !cat.parentCategory) // Categorías principales
              .map((parentCategory) => (
                <div key={parentCategory._id} className="p-4">
                  <Link
                    href={`/${parentCategory.name}`}
                    className="font-semibold text-gray-300"
                  >
                    {parentCategory.name}
                  </Link>
                  <ul>
                    {categories
                      .filter(
                        (cat) =>
                          String(cat.parentCategory) ===
                          String(parentCategory._id)
                      )
                      .map((subCategory) => (
                        <li key={subCategory._id}>
                          <Link
                            href={`/${parentCategory.name}/${subCategory.name}`}
                            className="text-sm text-gray-400 hover:text-blue-500"
                          >
                            {subCategory.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
