"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  createCategory,
  deleteCategory,
  updateCategoryName,
} from "@/lib/actions/categories";
import type { CategoryDTO } from "@/lib/types/categories";
import type { ProductDTO } from "@/lib/types/products";

export default function CategoriesAccordion({
  parentCategories,
}: {
  parentCategories: CategoryDTO[];
}) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <button
        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        onClick={async () => {
          const result = await Swal.fire({
            title: "Añadir categoría",
            html: `
              <select id="category-type" class="swal2-select">
                <option value="parent">Categoría principal</option>
                <option value="child">Subcategoría</option>
              </select>
              <select id="category-parent" class="swal2-select" style="display:none">
                ${parentCategories.map((parent) => `<option value="${parent._id}">${parent.name}</option>`).join("")}
              </select>
              <input id="category-name" class="swal2-input" placeholder="Nombre de la categoría">
            `,
            showCancelButton: true,
            confirmButtonText: "Crear",
            cancelButtonText: "Cancelar",
            didOpen: () => {
              const type = document.getElementById("category-type");
              const parent = document.getElementById("category-parent");
              type?.addEventListener("change", () => {
                if (parent)
                  parent.style.display =
                    (type as HTMLSelectElement).value === "child"
                      ? "block"
                      : "none";
              });
            },
            preConfirm: () => {
              const name = (
                document.getElementById("category-name") as HTMLInputElement
              )?.value.trim();
              if (!name) {
                Swal.showValidationMessage("El nombre es obligatorio");
                return false;
              }
              const type = (
                document.getElementById("category-type") as HTMLSelectElement
              ).value;
              const parentId = (
                document.getElementById("category-parent") as HTMLSelectElement
              )?.value;
              return {
                name,
                parentId: type === "child" ? parentId : undefined,
              };
            },
          });
          if (result.isConfirmed) {
            await createCategory(result.value.name, result.value.parentId);
            router.refresh();
          }
        }}
        type="button"
      >
        + Añadir categoría
      </button>
      {parentCategories.map((category) => (
        <ParentCategory
          key={category._id}
          category={category}
          onRefresh={() => router.refresh()}
        />
      ))}
      {parentCategories.length === 0 ? (
        <div className="dashboard-card p-8 text-center text-sm text-slate-500">
          No hay categorías para mostrar.
        </div>
      ) : null}
    </div>
  );
}

function ParentCategory({
  category,
  onRefresh,
}: {
  category: CategoryDTO;
  onRefresh: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex items-center gap-2 p-4">
        <button
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <ChevronIcon isOpen={isOpen} />
          <span className="truncate text-base font-bold">{category.name}</span>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
            {category.subcategories.length}
          </span>
        </button>
        <CategoryActions category={category} onRefresh={onRefresh} />
      </div>

      {isOpen ? (
        <div className="border-t border-slate-100 bg-slate-50/60 p-3">
          <div className="space-y-2">
            {category.subcategories.map((subcategory) => (
              <ChildCategory
                category={subcategory}
                key={subcategory._id}
                onRefresh={onRefresh}
              />
            ))}
            {category.subcategories.length === 0 ? (
              <p className="px-2 py-3 text-sm text-slate-500">
                No hay categorías hijas.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ChildCategory({
  category,
  onRefresh,
}: {
  category: CategoryDTO;
  onRefresh: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 p-3">
        <button
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <ChevronIcon isOpen={isOpen} />
          <span className="truncate text-sm font-bold">{category.name}</span>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {category.products.length} producto
            {category.products.length === 1 ? "" : "s"}
          </span>
        </button>
        <CategoryActions category={category} onRefresh={onRefresh} />
      </div>

      {isOpen ? (
        <div className="border-t border-slate-100 px-3 py-2">
          {category.products.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {category.products.map((product) => (
                <ProductRow key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-3 text-sm text-slate-500">
              No hay productos en esta categoría.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ProductRow({ product }: { product: ProductDTO }) {
  const hasOutlet = product.discount.outlet;
  const hasOffer = product.discount.offert && !hasOutlet;
  const displayPrice =
    product.discount.DiscountPrice > 0
      ? product.discount.DiscountPrice
      : product.price;

  return (
    <button
      className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-slate-50"
      onClick={() => undefined}
      type="button"
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
        {product.name}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {hasOutlet ? (
          <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
            Outlet
          </span>
        ) : hasOffer ? (
          <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
            Oferta
          </span>
        ) : null}
        <span className="text-sm font-bold text-slate-700">
          ${displayPrice}
        </span>
      </span>
    </button>
  );
}

function CategoryActions({
  category,
  onRefresh,
}: {
  category: CategoryDTO;
  onRefresh: () => void;
}) {
  const isParent = !category.parentCategory;
  const hasSubcategories = category.subcategories.length > 0;
  const hasProducts = category.products.length > 0;
  const canDelete = !isParent || (!hasSubcategories && !hasProducts);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        aria-label={`Editar categoría ${category.name}`}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-blue-500 transition-colors hover:bg-blue-50"
        onClick={async (event) => {
          event.stopPropagation();
          const result = await Swal.fire({
            title: "Cambiar nombre",
            input: "text",
            inputValue: category.name,
            inputPlaceholder: "Nombre de la categoría",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) =>
              !value.trim() ? "El nombre es obligatorio" : undefined,
          });
          if (result.isConfirmed) {
            await updateCategoryName(category._id, result.value);
            onRefresh();
          }
        }}
        type="button"
      >
        <EditIcon />
      </button>
      <button
        aria-label={`Eliminar categoría ${category.name}`}
        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
          canDelete
            ? "text-red-500 hover:bg-red-50"
            : "cursor-not-allowed text-slate-300"
        }`}
        disabled={!canDelete}
        onClick={async (event) => {
          event.stopPropagation();

          if (!canDelete) {
            const message = isParent
              ? hasSubcategories
                ? "La categoría principal no se puede borrar si tiene subcategorías. Primero elimina o mueves las subcategorías."
                : "La categoría principal solo se puede borrar si está vacía."
              : "No se puede borrar esta categoría.";

            await Swal.fire({
              title: "No se puede eliminar",
              text: message,
              icon: "info",
              confirmButtonText: "Entendido",
            });
            return;
          }

          const result = await Swal.fire({
            title: isParent ? "¿Eliminar categoría principal?" : "¿Eliminar categoría?",
            text: isParent
              ? "La categoría se eliminará solo si está vacía."
              : hasProducts
                ? `Se quitará "${category.name}" de ${category.products.length} producto(s). Los productos no se borrarán.`
                : `Se eliminará "${category.name}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
          });

          if (result.isConfirmed) {
            await deleteCategory(category._id);
            onRefresh();
          }
        }}
        type="button"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="17"
      viewBox="0 0 24 24"
      width="17"
    >
      <path
        d="m4 16-.8 4.8L8 20l11.5-11.5a2.8 2.8 0 0 0-4-4L4 16Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="m13.5 6.5 4 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="17"
      viewBox="0 0 24 24"
      width="17"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
