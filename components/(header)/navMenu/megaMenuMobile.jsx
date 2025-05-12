"use client";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMenu } from "../../providers/menuContext";

export default function MegaMenuMobile({
  dataCategories = [],
  children,
  boleans,
}) {
  const { isMenuOpen, closeMenu } = useMenu();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categories, setCategories] = useState([]);
  const { hasOutlet, hasOffers } = boleans;

  useEffect(() => {
    setCategories(dataCategories);
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Organizar categorías
  const parentCategories =
    categories?.filter((cat) => !cat.parentCategory) || [];
  const getSubcategories = (parentId) =>
    categories.filter(
      (cat) =>
        String(cat.parentCategory) === String(parentId) &&
        cat.products.some((prod) => prod.stock === true)
    );

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-900 text-gray-100 flex flex-col transition-all duration-300 ${
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
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

      {children}

      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          <Link
            href="/home"
            onClick={closeMenu}
            className="block px-4 py-2 font-medium"
          >
            Inicio
          </Link>

          {hasOutlet && (
            <Link
              href="/outlet"
              className="block px-4 py-2 font-medium"
              onClick={closeMenu}
            >
              Outlet
            </Link>
          )}
          {hasOffers && (
            <Link
              href="/ofertas"
              className="block px-4 py-2 font-medium"
              onClick={closeMenu}
            >
              Ofertas de la semana
            </Link>
          )}

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
        </nav>
      </div>
    </div>
  );
}
