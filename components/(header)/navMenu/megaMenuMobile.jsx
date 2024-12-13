import { getCategories } from "@/lib/actions/categories";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MegaMenuMobile({ menuOpen, onClose }) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fecthCategories = async () => {
      const response = await getCategories(true);
      setCategories(response);
    };
    fecthCategories();
  }, []);

  const closeMenu = () => onClose();
  return (
    <>
      {menuOpen && (
        <div className="sm:hidden fixed top-0 left-0 w-full h-full bg-gray-800 text-white z-50">
          {/* Botón de cerrar */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
            <span className="text-lg font-semibold">Menú</span>
            <button onClick={closeMenu}>
              <XMarkIcon width={24} height={24} className="text-white" />
            </button>
          </div>

          {/* Opciones del menú */}
          <div className="py-4 px-4">
            <Link
              href={"/home"}
              onClick={closeMenu}
              className="block w-full text-left text-sm py-2 hover:text-blue-500"
            >
              Home
            </Link>
            <button
              className="w-full flex items-center gap-1 text-left text-sm py-2 hover:text-blue-500"
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            >
              Categorías
              {megaMenuOpen ? (
                <ChevronDownIcon width={20} height={20} />
              ) : (
                <ChevronRightIcon width={20} height={20} />
              )}
            </button>

            {/* Mega menú para móvil */}
            {megaMenuOpen && (
              <div
                onClick={closeMenu}
                className="bg-gray-700 p-4 rounded-lg mt-2"
              >
                <div className="grid grid-cols-2 gap-4">
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

            <Link
              href={"/outlet"}
              onClick={closeMenu}
              className="block w-full text-left text-sm py-2 hover:text-blue-500"
            >
              Outlet
            </Link>
            <Link
              href={"/ofertas"}
              onClick={closeMenu}
              // quitar hidden cuando este la parte de ofertas
              className="hidden w-full text-left text-sm py-2 hover:text-blue-500"
            >
              Ofertas
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
