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
              (name) => name !== categoryName,
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
    (category) => !category.parentCategory,
  );

  return (
    <div className="relative w-full">
      {/* Selector */}
      <div
        onClick={toggleDropdown}
        className="flex cursor-pointer items-center justify-between rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white shadow-md transition-all hover:shadow-lg"
      >
        <span className="font-semibold">
          {data.category || data.additionalCategories.length > 0
            ? `Categorías seleccionadas: ${getSelectedCategoriesText()}`
            : "Selecciona una o varias categorías"}
        </span>
        <ChevronDownIcon className="h-6 w-6" />
      </div>

      {/* Modal */}
      {dropdownOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-30 flex items-center justify-center bg-black">
          {/* Contenido del modal */}
          <div className="relative w-3/4 max-w-3xl rounded-lg bg-gray-800 p-6 text-gray-200 shadow-xl">
            {/* Botón cerrar */}
            <button
              onClick={toggleDropdown}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="mb-4 text-xl font-bold text-white">
              Selecciona tus categorías
            </h2>
            <div className="mx-auto grid max-h-96 gap-4 overflow-x-hidden overflow-y-auto">
              {mainCategories.map((cat, i) => (
                <div key={i} className="mb-4">
                  {/* Categoría principal */}
                  <p className="text-lg font-bold text-indigo-400">
                    {cat.name}
                  </p>
                  <div className="mt-2 ml-6 flex flex-wrap gap-2">
                    {cat.subcategories.map((subcategory) => {
                      const isSelected =
                        subcategory.name === data.category ||
                        data.additionalCategories.includes(subcategory.name);

                      return (
                        <div
                          key={subcategory.name}
                          onClick={() => handleCategoryClick(subcategory.name)}
                          className={`flex w-fit cursor-pointer items-center justify-between gap-4 rounded-lg px-4 py-2 transition-colors duration-200 ${
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
            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleDropdown}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-white shadow-md hover:bg-indigo-500"
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
