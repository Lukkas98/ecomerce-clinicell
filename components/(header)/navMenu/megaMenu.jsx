"use client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function MegaMenu({ dataCategories = [] }) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = dataCategories;

  const getSubcategories = (parentId) =>
    categories.filter(
      (cat) =>
        String(cat.parentCategory) === String(parentId) &&
        cat.products.some((prod) => prod.stock === true)
    );

  const parentCategories =
    categories?.filter((cat) => {
      if (cat.parentCategory) return false;
      return getSubcategories(cat._id).length > 0;
    }) || [];

  return (
    <div
      className="relative"
      onMouseEnter={() => setMegaMenuOpen(true)}
      onMouseLeave={() => {
        setMegaMenuOpen(false);
        setActiveCategory(null);
      }}
    >
      {/* Botón principal */}
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-blue-400 transition-colors"
        aria-expanded={megaMenuOpen}
      >
        Categorías
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            megaMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel del mega menú */}
      {megaMenuOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 w-[95%] bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 overflow-hidden">
          <div className="flex">
            {/* Columna de categorías principales */}
            <div className="w-56 bg-gray-800/90 border-r border-gray-700">
              {parentCategories.map((parentCat) => (
                <div
                  key={parentCat._id}
                  className={`border-b border-gray-700 last:border-b-0 ${
                    activeCategory === parentCat._id ? "bg-gray-700" : ""
                  }`}
                  onMouseEnter={() => setActiveCategory(parentCat._id)}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-3 pr-2`}
                  >
                    <span className="font-medium hover:text-blue-400 transition-colors">
                      {parentCat.name}
                    </span>

                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        activeCategory === parentCat._id ? "-rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Columna de subcategorías */}
            {activeCategory && (
              <div className="flex-1 p-6">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {getSubcategories(activeCategory).map((subCat) => (
                    <div key={subCat._id} className="group">
                      <Link
                        href={`/${
                          parentCategories.find((p) => p._id === activeCategory)
                            ?.name
                        }/${subCat.name}`}
                        onClick={() => setMegaMenuOpen(false)}
                        className="block text-base font-medium mb-2 text-gray-200 group-hover:text-blue-400 transition-colors"
                      >
                        {subCat.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!activeCategory && (
              <div className="flex-1 flex items-center justify-center p-6">
                <p className="text-gray-400">Selecciona una categoría</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
