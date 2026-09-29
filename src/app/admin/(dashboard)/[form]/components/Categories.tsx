"use client";

import { useMemo, useState } from "react";
import type { CategoryDTO } from "@/lib/types/categories";

type CategoryOption = {
  category: CategoryDTO;
  level: number;
  parentName: string;
};

type CategoriesProps = {
  categories: CategoryDTO[];
  selectedCategoryIds: string[];
  onToggleCategory: (categoryId: string) => void;
};

function flattenSubcategories(
  categories: CategoryDTO[],
  parentName: string,
  level = 0,
): CategoryOption[] {
  return categories.flatMap((category) => [
    { category, level, parentName },
    ...flattenSubcategories(category.subcategories ?? [], parentName, level + 1),
  ]);
}

function getCategoryOptions(categories: CategoryDTO[]) {
  const options = categories
    .filter((category) => !category.parentCategory)
    .flatMap((parent) =>
      flattenSubcategories(parent.subcategories ?? [], parent.name),
    );

  return Array.from(
    new Map(options.map((option) => [option.category._id, option])).values(),
  );
}

export default function Categories({
  categories,
  selectedCategoryIds,
  onToggleCategory,
}: CategoriesProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const categoryOptions = useMemo(() => getCategoryOptions(categories), [categories]);
  const visibleCategoryOptions = categoryOptions.slice(0, 4);
  const filteredCategoryOptions = categoryOptions.filter(
    ({ category, parentName }) =>
      `${category.name} ${parentName}`
        .toLowerCase()
        .includes(categorySearch.trim().toLowerCase()),
  );

  return (
    <fieldset>
      <legend className="text-sm font-semibold">Categorías</legend>

      <p className="mt-1 text-xs text-slate-500">
        Selecciona una o varias subcategorías.
      </p>

      <div className="mt-3 space-y-3">
        {categoryOptions.length ? (
          visibleCategoryOptions.map(({ category, level, parentName }) => {
            const isSelected = selectedCategoryIds.includes(category._id);

            return (
              <label
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white"
                }`}
                key={`subcategory-${category._id}`}
              >
                <input
                  checked={isSelected}
                  className="h-5 w-5 accent-blue-600"
                  onChange={() => onToggleCategory(category._id)}
                  type="checkbox"
                />

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {"— ".repeat(Math.max(level - 1, 0))}
                    {category.name}
                  </span>

                  <span className="block text-xs text-slate-500">
                    {parentName}
                  </span>
                </span>
              </label>
            );
          })
        ) : (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            No hay subcategorías disponibles.
          </p>
        )}
      </div>

      {categoryOptions.length > 4 ? (
        <button
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-blue-600"
          onClick={() => setShowAllCategories(true)}
          type="button"
        >
          Ver todas ({categoryOptions.length})
        </button>
      ) : null}

      {selectedCategoryIds.length ? (
        <p className="mt-2 text-xs text-slate-500">
          {selectedCategoryIds.length} seleccionada
          {selectedCategoryIds.length === 1 ? "" : "s"}
        </p>
      ) : null}

      {showAllCategories ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 p-4">
            <button
              aria-label="Cerrar"
              className="rounded-full p-2 text-xl leading-none text-slate-500"
              onClick={() => {
                setShowAllCategories(false);
                setCategorySearch("");
              }}
              type="button"
            >
              ×
            </button>

            <h2 className="text-sm font-bold">Todas las categorías</h2>
          </div>

          <div className="border-b border-slate-200 p-4">
            <input
              autoFocus
              className="form-input"
              onChange={(event) => setCategorySearch(event.target.value)}
              placeholder="Buscar categoría..."
              type="search"
              value={categorySearch}
            />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {filteredCategoryOptions.length ? (
              filteredCategoryOptions.map(({ category, level, parentName }) => {
                const isSelected = selectedCategoryIds.includes(category._id);

                return (
                  <label
                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white"
                    }`}
                    key={`subcategory-modal-${category._id}`}
                  >
                    <input
                      checked={isSelected}
                      className="h-5 w-5 accent-blue-600"
                      onChange={() => onToggleCategory(category._id)}
                      type="checkbox"
                    />

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {"— ".repeat(Math.max(level - 1, 0))}
                        {category.name}
                      </span>

                      <span className="block text-xs text-slate-500">
                        {parentName}
                      </span>
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                No hay categorías que coincidan con "{categorySearch}".
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <button
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white"
              onClick={() => {
                setShowAllCategories(false);
                setCategorySearch("");
              }}
              type="button"
            >
              Listo ({selectedCategoryIds.length})
            </button>
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}
