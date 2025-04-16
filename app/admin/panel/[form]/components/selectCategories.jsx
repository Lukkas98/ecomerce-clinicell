"use client";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function SelectCategories({ data, categories, handleOnChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!data.category && data.additionalCategories.length > 0) {
      handleOnChange({
        target: {
          name: "category",
          value: data.additionalCategories[0],
        },
      });
      handleOnChange({
        target: {
          name: "additionalCategories",
          value: data.additionalCategories.slice(1),
        },
      });
    }
  }, [data.category, data.additionalCategories, handleOnChange]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const getSelectedCategoriesText = () => {
    const mainCategory = data.category || "";
    const additionalCategories = categories
      .filter((cat) => data.additionalCategories.includes(cat.name))
      .map((cat) => cat.name)
      .join(", ");
    return (
      mainCategory + (additionalCategories ? `, ${additionalCategories}` : "")
    );
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === data.category) {
      handleOnChange({ target: { name: "category", value: "" } });
    } else if (!data.category) {
      handleOnChange({ target: { name: "category", value: categoryName } });
    } else {
      const alreadySelected = data.additionalCategories.includes(categoryName);
      if (alreadySelected) {
        handleOnChange({
          target: {
            name: "additionalCategories",
            value: data.additionalCategories.filter(
              (name) => name !== categoryName
            ),
          },
        });
      } else if (categoryName !== data.category) {
        handleOnChange({
          target: {
            name: "additionalCategories",
            value: [...data.additionalCategories, categoryName],
          },
        });
      }
    }
  };

  const mainCategories = categories.filter(
    (category) => !category.parentCategory
  );

  return (
    <div className="relative w-full">
      {/* Selector */}
      <div
        onClick={toggleDropdown}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition-all"
      >
        <span className="font-semibold">
          {data.category || data.additionalCategories.length > 0
            ? `Categorías seleccionadas: ${getSelectedCategoriesText()}`
            : "Selecciona una o varias categorías"}
        </span>
        <ChevronDownIcon className="w-6 h-6" />
      </div>

      {/* Modal */}
      {dropdownOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
          {/* Contenido del modal */}
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-3/4 max-w-3xl p-6 relative">
            {/* Botón cerrar */}
            <button
              onClick={toggleDropdown}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">
              Selecciona tus categorías
            </h2>
            <div className="max-h-96 grid gap-4 overflow-y-auto overflow-x-hidden mx-auto">
              {mainCategories.map((cat, i) => (
                <div key={i} className="mb-4">
                  {/* Categoría principal */}
                  <p className="text-lg font-bold text-indigo-400">
                    {cat.name}
                  </p>
                  <div className="ml-6 mt-2 flex flex-wrap gap-2">
                    {cat.subcategories.map((subcategory) => {
                      const isSelected =
                        subcategory.name === data.category ||
                        data.additionalCategories.includes(subcategory.name);

                      return (
                        <div
                          key={subcategory.name}
                          onClick={() => handleCategoryClick(subcategory.name)}
                          className={`flex w-fit gap-4 items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          <span className="">{subcategory.name}</span>
                          {isSelected && (
                            <CheckIcon
                              width={20}
                              height={20}
                              className="text-green-400"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Botón confirmar */}
            <div className="flex justify-end mt-6">
              <button
                onClick={toggleDropdown}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md"
              >
                Confirmar selección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
