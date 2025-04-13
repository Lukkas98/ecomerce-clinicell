import { getCategories } from "@/lib/actions/categories";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MegaMenuMobile({ menuOpen, onClose }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories(true);
      setCategories(response);
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const closeMenu = () => {
    setExpandedCategories({});
    onClose();
  };

  if (!menuOpen) return null;

  // Organizar categorías
  const parentCategories =
    categories?.filter((cat) => !cat.parentCategory) || [];
  const getSubcategories = (parentId) =>
    categories.filter((cat) => String(cat.parentCategory) === String(parentId));

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Menú</h2>
        <button
          onClick={closeMenu}
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Cerrar menú"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          <Link
            href="/home"
            onClick={closeMenu}
            className="block px-4 py-3 hover:bg-gray-800 transition-colors font-medium"
          >
            Inicio
          </Link>

          {/* Categorías principales */}
          {parentCategories.map((parentCat) => {
            const hasSubcategories = getSubcategories(parentCat._id).length > 0;

            return (
              <div key={parentCat._id} className="border-b border-gray-800">
                <div
                  className={`flex justify-between items-center px-4 py-3 ${
                    hasSubcategories ? "cursor-pointer" : ""
                  }`}
                  onClick={() =>
                    hasSubcategories && toggleCategory(parentCat._id)
                  }
                >
                  <span className="font-medium hover:text-blue-400 transition-colors">
                    {parentCat.name}
                  </span>
                  {hasSubcategories && (
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform ${
                        expandedCategories[parentCat._id] ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Subcategorías */}
                {expandedCategories[parentCat._id] && (
                  <div className="bg-gray-800/50 pl-6">
                    {getSubcategories(parentCat._id).map((subCat) => (
                      <Link
                        key={subCat._id}
                        href={`/${parentCat.name}/${subCat.name}`}
                        onClick={closeMenu}
                        className="block px-4 py-3 text-sm hover:bg-gray-700/50 hover:text-blue-400 transition-colors"
                      >
                        {subCat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/outlet"
            onClick={closeMenu}
            className="block px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition-colors font-medium"
          >
            Outlet
          </Link>
          <Link
            href="/ofertas"
            onClick={closeMenu}
            className="block px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition-colors font-medium"
          >
            Ofertas
          </Link>
        </nav>
      </div>
    </div>
  );
}
