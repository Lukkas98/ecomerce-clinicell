"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProductFromForm,
  updateProductFromForm,
  type CreateProductState,
} from "@/lib/actions/products";
import type { CategoryDTO } from "@/lib/types/categories";
import type { ProductDTO, ProductImage } from "@/lib/types/products";

const initialState: CreateProductState = { ok: false, message: "" };

type ImagePreview = ProductImage & { file?: File; previewUrl?: string };

type CategoryOption = {
  category: CategoryDTO;
  level: number;
  parentName: string;
};

function flattenSubcategories(
  categories: CategoryDTO[],
  parentName: string,
  level = 0,
): CategoryOption[] {
  return categories.flatMap((category) => [
    { category, level, parentName },
    ...flattenSubcategories(
      category.subcategories ?? [],
      parentName,
      level + 1,
    ),
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

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

export default function CreateProductForm({
  product,
  categories,
  mode,
}: {
  product: ProductDTO | null;
  categories: CategoryDTO[];
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImagePreview[]>(product?.images ?? []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories ?? [],
  );
  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const categoryOptions = getCategoryOptions(categories);

  function addImages(files: FileList | null) {
    if (!files) return;
    const nextImages = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((current) => [...current, ...nextImages]);
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }

  async function handleSubmit(formData: FormData) {
    try {
      const uploadedImages: ProductImage[] = [];
      const productName = String(formData.get("name") ?? "").trim();
      const categoryName =
        categoryOptions.find((option) =>
          selectedCategories.includes(option.category._id),
        )?.category.name ?? "productos";

      for (const [index, image] of images.entries()) {
        if (!image.file) {
          uploadedImages.push({ url: image.url, publicId: image.publicId });
          continue;
        }

        const base64Image = await fileToDataUrl(image.file);
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image,
            index,
            name: productName,
            category: categoryName,
          }),
        });
        const result = (await response.json()) as ProductImage & { error?: string };
        if (!response.ok || !result.url) {
          throw new Error(result.error ?? "No se pudo subir la imagen");
        }
        uploadedImages.push({ url: result.url, publicId: result.publicId });
      }

      formData.delete("categories");
      [...new Set(selectedCategories)].forEach((categoryId) =>
        formData.append("categories", categoryId),
      );
      formData.set("images", JSON.stringify(uploadedImages));
      if (product?._id) formData.set("productId", product._id);

      startTransition(async () => {
        const result =
          mode === "create"
            ? await createProductFromForm(initialState, formData)
            : await updateProductFromForm(initialState, formData);
        setState(result);
        if (result.ok) router.push("/admin/products");
      });
    } catch (error) {
      setState({
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo guardar el producto",
      });
    }
  }

  return (
    <form action={handleSubmit} className="dashboard-card mt-6 space-y-5 p-5">
      <label className="block">
        <span className="text-sm font-semibold">Nombre</span>
        <input className="form-input" defaultValue={product?.name} name="name" required />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Descripción</span>
        <textarea
          className="form-input min-h-24 resize-y"
          defaultValue={product?.description}
          name="description"
          required
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-semibold">Precio</span>
          <input className="form-input" defaultValue={product?.price} min="0" name="price" required step="0.01" type="number" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Stock</span>
          <input className="form-input" defaultValue={product?.stock} min="0" name="stock" required type="number" />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">Categorías</legend>
        <p className="mt-1 text-xs text-slate-500">
          Selecciona una o varias subcategorías.
        </p>
        <div className="mt-3 space-y-3">
          {categoryOptions.length ? (
            categoryOptions.map(({ category, level, parentName }) => {
              const isSelected = selectedCategories.includes(category._id);
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
                    onChange={() =>
                      setSelectedCategories((current) =>
                        isSelected
                          ? current.filter((id) => id !== category._id)
                          : [...new Set([...current, category._id])],
                      )
                    }
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
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Precio de oferta (opcional)</span>
        <input className="form-input" defaultValue={product?.offert || undefined} min="0" name="offert" step="0.01" type="number" />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input defaultChecked={product?.outlet.isActive} name="outlet" type="checkbox" />
        Producto en outlet
      </label>

      <div>
        <span className="text-sm font-semibold">Imágenes</span>
        <input
          ref={inputRef}
          accept="image/*"
          className="form-input"
          multiple
          onChange={(event) => {
            addImages(event.target.files);
            event.target.value = "";
          }}
          type="file"
        />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100" key={`${image.url ?? image.previewUrl}-${index}`}>
              <img alt="" className="h-full w-full object-cover" src={image.previewUrl ?? image.url} />
              <button
                aria-label="Quitar imagen"
                className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white"
                onClick={() => removeImage(index)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Guardando..." : mode === "create" ? "Guardar producto" : "Guardar cambios"}
      </button>

      {state.message ? (
        <p className={state.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}>{state.message}</p>
      ) : null}
    </form>
  );
}
