"use client";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function SelectCategories({ data, categories, handleOnChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Si no hay categoría principal, mover el primer adicional a `category`
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
      // Reemplaza la categoría principal si se selecciona una diferente
      handleOnChange({
        target: {
          name: "category",
          value: "",
        },
      });
    } else if (!data.category) {
      // Asignar la categoría principal si no hay una seleccionada
      handleOnChange({
        target: {
          name: "category",
          value: categoryName,
        },
      });
    } else {
      const alreadySelected = data.additionalCategories.includes(categoryName);

      if (alreadySelected) {
        // Remover de additionalCategories si ya está seleccionada
        handleOnChange({
          target: {
            name: "additionalCategories",
            value: data.additionalCategories.filter(
              (name) => name !== categoryName
            ),
          },
        });
      } else {
        // Evitar duplicados entre `category` y `additionalCategories`
        if (categoryName !== data.category) {
          handleOnChange({
            target: {
              name: "additionalCategories",
              value: [...data.additionalCategories, categoryName],
            },
          });
        }
      }
    }
  };

  return (
    <div className="relative w-full">
      <div
        onClick={toggleDropdown}
        className="bg-gray-200 p-3 rounded cursor-pointer flex justify-between items-center"
      >
        <span>
          {data.category || data.additionalCategories.length > 0
            ? `Categorías: ${getSelectedCategoriesText()}`
            : "Selecciona una categoría o varias"}
        </span>
        <ArrowDownIcon width={15} height={15} />
      </div>

      {dropdownOpen && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-20">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`p-2 cursor-pointer transition-colors duration-200 ${
                category.name === data.category ||
                data.additionalCategories.includes(category.name)
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
