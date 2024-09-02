"use client";

import { useState, useTransition, useEffect } from "react";
import UploadFirebase from "./uploadFirebase";
import {
  createProduct,
  deleteImageByUrl,
  editProduct,
} from "@/lib/actions/products";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import { createCategory } from "@/lib/actions/categories";
import { productSchema } from "./validation";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 2000,
  timerProgressBar: true,
  showConfirmButton: false,
});

export default function Form({
  categories,
  mode = "create",
  initialData = {},
}) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: "",
    price: 0,
    stock: true,
    description: "",
    category: "Categoria1",
    imagesForUpload: [],
    imagesSelected: [], //para subirlas a firebase
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setData({
        ...initialData,
        imagesSelected: initialData.images || [], // asume que tienes URLs de imágenes en initialData
      });
    }
  }, [mode, initialData]);

  const handleOnClick = async () => {
    const { value: categoryName } = await Swal.fire({
      title: "Crear Categoría",
      input: "text",
      inputLabel: "Ingresa el nombre de la Categoría nueva",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "No puede estar vacio";
        }
      },
    });
    if (categoryName) {
      try {
        const response = await createCategory(categoryName);

        if (!response.success) throw new Error(response.message);

        Swal.fire("Categoría Creada", response.message, "success");
      } catch (error) {
        Swal.fire("Ups..", error.message, "error");
      }
    }
  };

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    setData((oldValues) => {
      let updatedValue = value;

      if (name === "imagesForUpload") {
        updatedValue = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        // Combinar con las imágenes ya seleccionadas
        updatedValue = [...(oldValues.imagesSelected || []), ...updatedValue];
      } else if (name === "price") {
        updatedValue = Number(value);
      }

      return {
        ...oldValues,
        [name]: updatedValue,
        ...(name === "imagesForUpload" && { imagesSelected: updatedValue }),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      productSchema.parse(data);

      startTransition(async () => {
        const imageUrls = data.imagesSelected;
        const PromisesUrls = imageUrls.map(async (url, i) => {
          if (url.includes("https://firebasestorage")) return url;

          const nameCapitalized =
            data.name[0].toUpperCase() + data.name.slice(1).toLowerCase();

          return await UploadFirebase(url, i, nameCapitalized, data.category);
        });
        const Urls = await Promise.all(PromisesUrls);

        const result =
          mode === "create"
            ? await createProduct(data, Urls)
            : await editProduct(data, Urls);

        if (!result.success) {
          Toast.fire("Ups..", "No pudo subise el producto", "error");
          console.error(result.message);
          return;
        }

        Toast.fire({
          icon: "success",
          title: result.message,
          text: "Volviendo al panel",
          didClose: () => {
            router.replace("/admin/panel");
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
    Swal.fire({
      title: "¿Quieres eliminar esta imagen?",
      showDenyButton: true,
      confirmButtonText: "Si, Borrar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      preConfirm: async () => {
        try {
          const response = image.includes("https://firebasestorage")
            ? await deleteImageByUrl(image, data.name)
            : { success: true, message: "imagen borrada" };

          if (!response.success)
            return Swal.showValidationMessage(response.message);

          setData((oldValues) => {
            return {
              ...oldValues,
              imagesSelected: oldValues.imagesSelected.filter(
                (img) => img !== image
              ),
            };
          });
          return response.message;
        } catch (error) {
          return Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      //boton "Si, Borrar"
      if (result.isConfirmed) {
        Toast.fire({
          icon: "success",
          title: "Completado",
          text: result.value,
        });

        //boton "No"
      } else if (result.isDenied) {
        Toast.fire({
          icon: "info",
          title: "Acción cancelada",
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-[80%] mx-auto px-3 py-2"
    >
      <div className="flex flex-col">
        <input
          className="w-[90%] border-2 px-2 py-1 border-gray-400 rounded focus:border-blue-600 outline-none"
          type="text"
          name="name"
          placeholder="Nombre"
          value={data.name}
          onChange={handleOnChange}
        />
        <span className="text-red-700 text-sm">{errors.name ?? ""}</span>
      </div>

      <div className="flex flex-col">
        <input
          className="w-[90%] border-2 px-2 py-1 border-gray-400 rounded focus:border-blue-600 outline-none"
          type="number"
          name="price"
          placeholder="Precio"
          value={data.price || ""}
          onChange={handleOnChange}
        />
        <span className="text-red-700 text-sm">{errors.price ?? ""}</span>
      </div>

      <div className="flex flex-col">
        <textarea
          className="w-[90%] max-h-60 h-52 border-2 px-2 py-1 border-gray-400 rounded focus:border-blue-600 outline-none"
          type="text"
          name="description"
          placeholder="Descripción"
          value={data.description}
          onChange={handleOnChange}
        />
        <span className="text-red-700 text-sm">{errors.description ?? ""}</span>
      </div>

      <div className="flex flex-col w-11/12">
        <div className="flex justify-between">
          <p>Selecciona la categoria</p>
          <span
            onClick={handleOnClick}
            className="bg-blue-500 py-1 px-2 rounded text-sm text-white cursor-pointer"
          >
            Crear Categoría
          </span>
        </div>
        <select
          name="category"
          onChange={handleOnChange}
          value={data.category}
          className="w-full mx-auto px-2 py-1 mt-2"
        >
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <span className="text-red-700 text-sm">{errors.category ?? ""}</span>
      </div>

      <div className="mx-auto">
        <input
          type="file"
          name="imagesForUpload"
          onChange={handleOnChange}
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-500 transition-all
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-200 file:text-violet-800
                   hover:file:bg-violet-500 hover:file:text-violet-200"
        />

        <div className="mt-4 flex flex-wrap gap-4">
          {data.imagesSelected.map((image, i) => (
            <div key={i} className="relative mt-5">
              <div className="relative w-20 aspect-square rounded-lg overflow-hidden shadow-black shadow">
                <div className="relative w-20 aspect-square rounded-lg overflow-hidden shadow-black shadow-md">
                  <Image
                    src={image}
                    alt={`Selected preview ${i}`}
                    fill={true}
                    sizes="80px"
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  deleteImage(image);
                }}
                title="Borrar"
                className=" absolute z-10 bg-red-500 rounded px-2 right-0 -top-5 cursor-pointer"
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
          className="bg-blue-600 hover:bg-blue-700 font-bold text-blue-50 px-2 py-1 rounded-md w-full self-center"
        >
          {mode === "create" ? "Crear" : "Actualizar"}
        </button>
      )}
      {isLoading && (
        <span className="bg-blue-600 font-bold text-blue-50 px-2 py-1 rounded-md w-full self-center">
          Procesando, por favor espere...
        </span>
      )}
    </form>
  );
}
