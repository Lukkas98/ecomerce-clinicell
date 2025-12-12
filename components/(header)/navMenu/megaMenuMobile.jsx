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
  }, [dataCategories]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getSubcategories = (parentId) =>
    categories.filter(
      (cat) =>
        String(cat.parentCategory) === String(parentId) &&
        cat.products.some((prod) => prod.stock === true),
    );
  // Organizar categorías
  const parentCategories = categories?.filter((cat) => {
    return (!cat.parentCategory || []) && getSubcategories(cat._id).length > 0;
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-gray-900 text-gray-100 transition-all duration-300 ${
        isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <h2 className="text-xl font-semibold">Menú</h2>
        <button
          onClick={closeMenu}
          className="rounded-full p-1 transition-colors hover:bg-gray-800"
          aria-label="Cerrar menú"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {children}

      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          <Link
            href="/"
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
            return (
              <div key={parentCat._id} className="border-b border-gray-800">
                <div
                  className={`flex cursor-pointer items-center justify-between px-4 py-3`}
                  onClick={() => toggleCategory(parentCat._id)}
                >
                  <span className="font-medium transition-colors hover:text-blue-400">
                    {parentCat.name}
                  </span>

                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${
                      expandedCategories[parentCat._id] ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Subcategorías */}
                {expandedCategories[parentCat._id] && (
                  <div className="bg-gray-800/50 pl-6">
                    {getSubcategories(parentCat._id).map((subCat) => (
                      <Link
                        key={subCat._id}
                        href={`/${parentCat.name}/${subCat.name}`}
                        onClick={closeMenu}
                        className="block px-4 py-3 text-sm transition-colors hover:bg-gray-700/50 hover:text-blue-400"
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
