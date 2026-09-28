"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProductFromForm,
  updateProductFromForm,
  type CreateProductState,
} from "@/lib/actions/products";
import type { CategoryDTO } from "@/lib/types/categories";
import type { ProductDTO, ProductImage } from "@/lib/types/products";
import {
  validateProductField,
  validateProductForm,
  type ProductFormField,
} from "./validator";
import Categories from "./components/Categories";
import ProductImages from "./components/ProductImages";
import { notifyError, notifySuccess } from "@/lib/notify";

const initialState: CreateProductState = {
  ok: false,
  message: "",
};

type ImagePreview = ProductImage & {
  file?: File;
  previewUrl?: string;
};

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categories: string[];
  discountOffert: boolean;
  discountOutlet: boolean;
  discountPrice: string;
};

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

  const [formData, setFormData] = useState<ProductFormData>(() => ({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price != null ? String(product.price) : "",
    stock: product?.stock != null ? String(product.stock) : "",
    categories: product?.categories ?? [],
    discountOffert: Boolean(product?.discount?.offert),
    discountOutlet: Boolean(product?.discount?.outlet),
    discountPrice:
      product?.discount?.DiscountPrice != null
        ? String(product.discount.DiscountPrice)
        : "",
  }));

  const [images, setImages] = useState<ImagePreview[]>(product?.images ?? []);

  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ProductFormField, string>>
  >({});

  const showDiscountPrice = formData.discountOffert || formData.discountOutlet;

  function isProductFormField(field: string): field is ProductFormField {
    return field === "name" || field === "description" || field === "price";
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (isProductFormField(name)) {
      validateField(name, value);
    }
  }

  function validateField(field: ProductFormField, value: unknown) {
    const error = validateProductField(field, value);
    setFieldErrors((current) => ({
      ...current,
      [field]: error ?? undefined,
    }));
    return error;
  }

  function toggleCategory(categoryId: string) {
    setFormData((current) => ({
      ...current,
      categories: current.categories.includes(categoryId)
        ? current.categories.filter((id) => id !== categoryId)
        : [...new Set([...current.categories, categoryId])],
    }));
  }

  function addImages(files: FileList | null) {
    if (!files) return;
    const nextImages: ImagePreview[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((current) => [...current, ...nextImages]);
  }

  function removeImage(index: number) {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  async function handleSubmit(formDataFromBrowser: FormData) {
    try {
      const validation = validateProductForm(formData);

      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setFieldErrors({});

      const uploadedImages: ProductImage[] = [];

      const productName = formData.name.trim();

      const categoryName =
        categories.find((category) =>
          formData.categories.includes(category._id),
        )?.name ?? "productos";

      for (const [index, image] of images.entries()) {
        if (!image.file) {
          uploadedImages.push({
            url: image.url,
            publicId: image.publicId,
          });

          continue;
        }

        const base64Image = await fileToDataUrl(image.file);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64Image,
            index,
            name: productName,
            category: categoryName,
          }),
        });

        const result = (await response.json()) as ProductImage & {
          error?: string;
        };

        if (!response.ok || !result.url) {
          throw new Error(result.error ?? "No se pudo subir la imagen");
        }

        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
        });
      }

      /*
       * Preparar FormData para la Server Action
       */
      formDataFromBrowser.set("name", formData.name);
      formDataFromBrowser.set("description", formData.description);
      formDataFromBrowser.set("price", formData.price);
      formDataFromBrowser.set("stock", formData.stock);

      formDataFromBrowser.delete("categories");

      [...new Set(formData.categories)].forEach((categoryId) => {
        formDataFromBrowser.append("categories", categoryId);
      });

      formDataFromBrowser.set(
        "discountOffert",
        String(formData.discountOffert),
      );

      formDataFromBrowser.set(
        "discountOutlet",
        String(formData.discountOutlet),
      );

      if (showDiscountPrice) {
        formDataFromBrowser.set("discountPrice", formData.discountPrice);
      } else {
        formDataFromBrowser.delete("discountPrice");
      }

      formDataFromBrowser.set("images", JSON.stringify(uploadedImages));

      if (product?._id) {
        formDataFromBrowser.set("productId", product._id);
      }

      startTransition(async () => {
        const result =
          mode === "create"
            ? await createProductFromForm(initialState, formDataFromBrowser)
            : await updateProductFromForm(initialState, formDataFromBrowser);

        setState(result);

        if (result.ok) {
          setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            categories: [],
            discountOffert: false,
            discountOutlet: false,
            discountPrice: "",
          });

          setImages([]);
          setFieldErrors({});
          setState(initialState);

          await notifySuccess(result.message || "Producto guardado");
          router.replace("/admin/products");
        } else {
          await notifyError(result.message || "No se pudo guardar el producto");
        }
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto";

      setState({
        ok: false,
        message,
      });

      await notifyError(message);
    }
  }

  return (
    <form action={handleSubmit} className="dashboard-card mt-6 space-y-5 p-5">
      {/* Nombre */}
      <label className="block">
        <span className="text-sm font-semibold">Nombre</span>

        <input
          className="form-input"
          name="name"
          onChange={handleChange}
          required
          value={formData.name}
        />

        {fieldErrors.name ? (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
        ) : null}
      </label>

      {/* Descripción */}
      <label className="block">
        <span className="text-sm font-semibold">Descripción</span>

        <textarea
          className="form-input min-h-24 resize-y"
          name="description"
          onChange={handleChange}
          required
          value={formData.description}
        />

        {fieldErrors.description ? (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
        ) : null}
      </label>

      {/* Precio / Stock */}
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-semibold">Precio</span>

          <input
            className="form-input"
            min="0"
            name="price"
            onChange={handleChange}
            required
            type="number"
            value={formData.price}
          />

          {fieldErrors.price ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Stock</span>

          <input
            className="form-input"
            min="0"
            name="stock"
            onChange={handleChange}
            required
            type="number"
            value={formData.stock}
          />
          {fieldErrors.stock ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.stock}</p>
          ) : null}
        </label>
      </div>

      <Categories
        categories={categories}
        onToggleCategory={toggleCategory}
        selectedCategoryIds={formData.categories}
      />

      {/* Descuentos */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            checked={formData.discountOffert}
            className="h-4 w-4 accent-blue-600"
            disabled={formData.discountOutlet}
            name="discountOffert"
            onChange={(event) => {
              const checked = event.target.checked;

              setFormData((current) => ({
                ...current,
                discountOffert: checked,
                discountOutlet: checked ? false : current.discountOutlet,
              }));
            }}
            type="checkbox"
          />
          Oferta activa
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            checked={formData.discountOutlet}
            className="h-4 w-4 accent-orange-600"
            disabled={formData.discountOffert}
            name="discountOutlet"
            onChange={(event) => {
              const checked = event.target.checked;

              setFormData((current) => ({
                ...current,
                discountOutlet: checked,
                discountOffert: checked ? false : current.discountOffert,
              }));
            }}
            type="checkbox"
          />
          Outlet activo
        </label>
      </div>

      {/* Precio descuento */}
      {showDiscountPrice ? (
        <label className="block">
          <span className="text-sm font-semibold">Precio con descuento</span>

          <input
            className="form-input"
            min="0"
            name="discountPrice"
            onChange={handleChange}
            step="0.01"
            type="number"
            value={formData.discountPrice}
          />
          {fieldErrors.discountPrice ? (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.discountPrice}
            </p>
          ) : null}
        </label>
      ) : null}

      <ProductImages
        images={images}
        onAddImages={addImages}
        onRemoveImage={removeImage}
      />

      <button
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending
          ? "Guardando..."
          : mode === "create"
            ? "Guardar producto"
            : "Guardar cambios"}
      </button>

      {state.message ? (
        <p
          className={
            state.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
