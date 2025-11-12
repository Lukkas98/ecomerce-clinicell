"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { productSchema } from "./validation";
import SelectCategories from "./selectCategories";
import { deleteFromCloudinary } from "./actionCloudinary";
import { createProduct, editProduct } from "@/lib/actions/products";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 2000,
  timerProgressBar: true,
  showConfirmButton: false,
  background: "#374151",
  color: "#E5E7EB",
});

export default function Form({
  categories = [],
  mode = "create",
  initialData = {},
}) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(() => {
    if (mode === "edit" && initialData) {
      return {
        ...initialData,
        imagesSelected:
          initialData?.images?.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })) || [],
      };
    }
    return {
      name: "",
      price: 0,
      description: "",
      category: "",
      units: 0,
      additionalCategories: [],
      imagesForUpload: [],
      imagesSelected: [],
    };
  });

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    setData((oldValues) => {
      if (name === "imagesForUpload") {
        const newImages = Array.from(files).map((file) => ({
          url: URL.createObjectURL(file),
          publicId: null,
        }));

        return {
          ...oldValues,
          imagesSelected: [...oldValues.imagesSelected, ...newImages],
        };
      }

      const numberFields = ["price", "units"];
      let updatedValue = numberFields.includes(name) ? Number(value) : value;

      return {
        ...oldValues,
        [name]: updatedValue,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      productSchema.parse(data);

      startTransition(async () => {
        const uploadImages = async (img, i) => {
          if (img.publicId) return img;

          const response = await fetch(img.url);
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64Image: base64,
              index: i,
              name: data.name,
              category: data.category,
            }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || "Error subiendo imagen");

          return result; // { url, publicId }
        };

        const Imgs = await Promise.all(data.imagesSelected.map(uploadImages));
        //Imgs es un array de objetos con url y publicId

        const result =
          mode === "create"
            ? await createProduct(data, Imgs)
            : await editProduct(data, Imgs);

        if (!result.success) {
          Toast.fire("Error", result.message, "error");
          return;
        }

        Toast.fire({
          icon: "success",
          title: result.message,
          text: "Volviendo al panel",
          didClose: () => {
            if (mode === "edit") router.back();
            else router.replace("/admin/panel");
          },
        });
      });
    } catch (error) {
      const errMessage = JSON.parse(error.message);
      // console.error("errMessage: ", errMessage);
      errMessage.forEach((err) => {
        setErrors((oldValues) => {
          return {
            ...oldValues,
            [err.path[0]]: err.message,
          };
        });
      });
    }
  };

  const deleteImage = async (image) => {
    const { value: result } = await Swal.fire({
      title: "¿Quieres eliminar esta imagen?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#374151",
      color: "#E5E7EB",
    });

    if (result) {
      try {
        if (image.publicId) await deleteFromCloudinary(image.publicId);

        setData((old) => ({
          ...old,
          imagesSelected: old.imagesSelected.filter(
            (img) => img.url !== image.url,
          ),
        }));

        Toast.fire("Eliminada!", "Imagen removida", "success");
      } catch (error) {
        Toast.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full flex-col gap-6 rounded-lg bg-gray-800 px-4 py-4 shadow-lg"
    >
      <div className="flex flex-col">
        <input
          className="w-full rounded border-2 border-gray-500 bg-transparent px-3 py-2 text-gray-100 transition-all outline-none focus:border-blue-500"
          type="text"
          name="name"
          placeholder="Nombre"
          value={data.name}
          onChange={handleOnChange}
        />
        <span className="mt-1 text-sm text-red-500">{errors.name ?? ""}</span>
      </div>

      <div className="flex flex-col">
        <input
          className="w-full rounded border-2 border-gray-500 bg-transparent px-3 py-2 text-gray-100 transition-all outline-none focus:border-blue-500"
          type="number"
          name="price"
          placeholder="Precio"
          value={data.price || ""}
          onChange={handleOnChange}
        />
        <span className="mt-1 text-sm text-red-500">{errors.price ?? ""}</span>
      </div>

      {mode === "create" && (
        <div className="flex flex-col">
          <input
            className="w-full rounded border-2 border-gray-500 bg-transparent px-3 py-2 text-gray-100 transition-all outline-none focus:border-blue-500"
            type="number"
            name="units"
            placeholder="Unidades Disponibles"
            value={data.units || ""}
            onChange={handleOnChange}
          />
          <span className="mt-1 text-sm text-red-500">
            {errors.units ?? ""}
          </span>
        </div>
      )}

      <div className="flex flex-col">
        <textarea
          className="h-52 max-h-60 w-full rounded border-2 border-gray-500 bg-transparent px-3 py-2 text-gray-100 transition-all outline-none focus:border-blue-500"
          type="text"
          name="description"
          placeholder="Descripción"
          value={data.description}
          onChange={handleOnChange}
        />
        <span className="mt-1 text-sm text-red-500">
          {errors.description ?? ""}
        </span>
      </div>

      <div className="flex w-full flex-col">
        <SelectCategories
          data={data}
          categories={categories}
          handleOnChange={handleOnChange}
        />
        <span className="mt-1 text-sm text-red-500">
          {errors.category ?? ""}
        </span>
      </div>

      <div className="mx-auto w-full">
        <input
          type="file"
          name="imagesForUpload"
          onChange={handleOnChange}
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-300 transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-700"
        />

        <div className="mt-4 flex flex-wrap gap-4">
          {data.imagesSelected.map((image, i) => (
            <div key={i} className="relative mt-5">
              <div className="relative aspect-square w-20 overflow-hidden rounded-lg shadow-md shadow-black">
                <Image
                  src={image.url}
                  alt={`Selected preview ${i}`}
                  fill={true}
                  sizes="80px"
                />
              </div>
              <div
                onClick={() => {
                  deleteImage(image);
                }}
                title="Borrar"
                className="absolute -top-5 right-0 z-10 cursor-pointer rounded bg-red-500 px-2"
              >
                X
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isLoading && (
        <button
          type="submit"
          className="w-full rounded-md bg-blue-800 px-4 py-2 font-semibold text-gray-100 hover:bg-blue-900"
        >
          {mode === "create" ? "Crear" : "Actualizar"}
        </button>
      )}
      {isLoading && (
        <span className="w-full rounded-md bg-blue-700 px-4 py-2 text-center font-semibold text-gray-100 opacity-80">
          Procesando, por favor espere...
        </span>
      )}
    </form>
  );
}
