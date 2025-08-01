"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { productSchema } from "./validation";
import SelectCategories from "./selectCategories";
import { uploadToCloudinary, deleteFromCloudinary } from "./actionCloudinary";
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
  const [data, setData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    units: 0,
    additionalCategories: [], // Las categorías adicionales
    imagesForUpload: [],
    imagesSelected: [], //para subirlas a claudinary - array de objetos {url, publicId}
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setData({
        ...initialData,
        imagesSelected:
          initialData?.images?.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })) || [],
      });
    }
  }, [mode, initialData]);

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

          return await uploadToCloudinary(base64, i, data.name, data.category);
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
            (img) => img.url !== image.url
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
      className="flex flex-col gap-6 w-full mx-auto px-4 py-4 bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="flex flex-col">
        <input
          className="w-full border-2 px-3 py-2 border-gray-500 rounded focus:border-blue-500 bg-transparent text-gray-100 outline-none transition-all"
          type="text"
          name="name"
          placeholder="Nombre"
          value={data.name}
          onChange={handleOnChange}
        />
        <span className="text-red-500 text-sm mt-1">{errors.name ?? ""}</span>
      </div>

      <div className="flex flex-col">
        <input
          className="w-full border-2 px-3 py-2 border-gray-500 rounded focus:border-blue-500 bg-transparent text-gray-100 outline-none transition-all"
          type="number"
          name="price"
          placeholder="Precio"
          value={data.price || ""}
          onChange={handleOnChange}
        />
        <span className="text-red-500 text-sm mt-1">{errors.price ?? ""}</span>
      </div>

      {mode === "create" && (
        <div className="flex flex-col">
          <input
            className="w-full border-2 px-3 py-2 border-gray-500 rounded focus:border-blue-500 bg-transparent text-gray-100 outline-none transition-all"
            type="number"
            name="units"
            placeholder="Unidades Disponibles"
            value={data.units || ""}
            onChange={handleOnChange}
          />
          <span className="text-red-500 text-sm mt-1">
            {errors.units ?? ""}
          </span>
        </div>
      )}

      <div className="flex flex-col">
        <textarea
          className="w-full border-2 px-3 py-2 border-gray-500 rounded focus:border-blue-500 bg-transparent text-gray-100 outline-none transition-all max-h-60 h-52"
          type="text"
          name="description"
          placeholder="Descripción"
          value={data.description}
          onChange={handleOnChange}
        />
        <span className="text-red-500 text-sm mt-1">
          {errors.description ?? ""}
        </span>
      </div>

      <div className="flex flex-col w-full">
        <SelectCategories
          data={data}
          categories={categories}
          handleOnChange={handleOnChange}
        />
        <span className="text-red-500 text-sm mt-1">
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
          className="block w-full text-sm text-gray-300 transition-all
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-600 file:text-white
          hover:file:bg-violet-700"
        />

        <div className="mt-4 flex flex-wrap gap-4">
          {data.imagesSelected.map((image, i) => (
            <div key={i} className="relative mt-5">
              <div className="relative w-20 aspect-square rounded-lg overflow-hidden shadow-md shadow-black">
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
                className="absolute z-10 bg-red-500 rounded px-2 right-0 -top-5 cursor-pointer"
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
          className="bg-blue-800 hover:bg-blue-900 font-semibold text-gray-100 px-4 py-2 rounded-md w-full"
        >
          {mode === "create" ? "Crear" : "Actualizar"}
        </button>
      )}
      {isLoading && (
        <span className="bg-blue-700 opacity-80 font-semibold text-gray-100 px-4 py-2 rounded-md w-full text-center">
          Procesando, por favor espere...
        </span>
      )}
    </form>
  );
}
