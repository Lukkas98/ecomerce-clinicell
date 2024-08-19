"use client";

import { useState, useTransition, useEffect } from "react";
import UploadFirebase from "./uploadFirebase";
import { createProduct, editProduct } from "@/lib/actions/products";
import { productSchema } from "./validation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

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

  const handleOnChange = (e) => {
    if (["imagesForUpload"].includes(e.target.name)) {
      const files = [];

      for (let i = 0; i < e.target.files.length; i++) {
        files.push(URL.createObjectURL(e.target.files[i]));
      }

      setData((oldValues) => {
        return {
          ...oldValues,
          [e.target.name]: e.target.value,
          imagesSelected: files,
        };
      });
    } else if (e.target.name === "price") {
      setData((oldValues) => {
        return {
          ...oldValues,
          [e.target.name]: Number(e.target.value),
        };
      });
    } else {
      setData((oldValues) => {
        return {
          ...oldValues,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      productSchema.parse(data);

      startTransition(async () => {
        const imageUrls = data.imagesSelected;
        let Urls = !imageUrls[0].includes("https://firebasestorage")
          ? await UploadFirebase(imageUrls, data.name, data.category)
          : imageUrls;

        let result;
        if (mode === "create") {
          result = await createProduct(data, Urls);
        } else if (mode === "edit") {
          result = await editProduct(data); // asume que tienes un ID en initialData
        }

        if (!result.success) {
          Toast.fire("Ups..", result.message, "error");
          return;
        }

        Toast.fire({
          icon: "success",
          title: result.message,
          text: "Volviendo al panel",
          didClose: () => {
            router.push("/admin/panel");
          },
        });
      });
    } catch (error) {
      const errMessage = JSON.parse(error.message);
      console.error(errMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-[80%] mx-auto px-3 py-2"
    >
      <label className="w-full">
        <p>Nombre</p>
        <input
          className="w-[90%] border-2 px-2 py-1 border-gray-400 rounded focus:border-blue-600 outline-none"
          type="text"
          name="name"
          placeholder="...bateria"
          value={data.name}
          onChange={handleOnChange}
        />
      </label>
      <label>
        <p>Precio</p>
        <input
          className="w-[90%] border-2 px-2 py-1 border-gray-400 rounded focus:border-blue-600 outline-none"
          type="number"
          name="price"
          placeholder="...1000"
          value={data.price}
          onChange={handleOnChange}
        />
      </label>
      <label>
        <p>Descripción</p>
        <textarea
          className="w-[90%] max-h-60 border-2 px-2 py-1 border-gray-400 rounded focus:border-blue-600 outline-none"
          type="text"
          name="description"
          placeholder="...describe el producto"
          value={data.description}
          onChange={handleOnChange}
        />
      </label>
      <div className="flex">
        <label className="w-[90%]">
          <p>Selecciona la categoria</p>
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
        </label>
      </div>

      <div className="max-w-md mx-auto">
        <input
          type="file"
          name="imagesForUpload"
          onChange={handleOnChange}
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-500 transition-all
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-200 file:text-violet-800
                   hover:file:bg-violet-500 hover:file:text-violet-200"
        />

        <div className="mt-4 flex flex-wrap gap-4">
          {data.imagesSelected.map((image, index) => (
            <div
              key={index}
              className="relative w-20 aspect-square rounded-lg overflow-hidden shadow-black shadow"
            >
              <Image
                src={image}
                alt={`Selected preview ${index}`}
                className="object-cover"
                fill={true}
                sizes="80px"
              />
            </div>
          ))}
        </div>
      </div>
      {!isLoading && (
        <button
          type="submit"
          className=" bg-blue-600 hover:bg-blue-700 font-bold text-blue-50 px-2 py-1 rounded-md w-full self-center"
        >
          {mode === "create" ? "Crear" : "Actualizar"}
        </button>
      )}
      {isLoading && <span>Procesando, por favor espere...</span>}
    </form>
  );
}
