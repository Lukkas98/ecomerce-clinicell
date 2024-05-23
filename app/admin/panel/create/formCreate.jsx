"use client";

import { useState, useTransition } from "react";
import UploadFirebase from "./uploadFirebase";
import { createProduct } from "@/lib/actions";
import { productSchema } from "./validation";
import Toastify from "toastify-js";

export default function FormPage({ categories }) {
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

  const handleOnChange = (e) => {
    if (["imagesForUpload", "images"].includes(e.target.name)) {
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
        let Urls = await UploadFirebase(imageUrls, data.name, data.category);

        const createProd = createProduct(data, Urls);
        Toastify({
          text: createProd,
          className: "success",
          gravity: "top",
          position: "center",
          duration: 3000,
        }).showToast();

        setData({
          imagesSelected: "",
          imagesForUpload: "",
          category: "",
          description: "",
          price: "",
          name: "",
          stock: true,
        });
      });
    } catch (error) {
      const errMessage = JSON.parse(error.message);
      for (const err of errMessage) {
        Toastify({
          text: err.message,
          className: "warning",
          gravity: "top",
          position: "center",
          duration: 3000,
        }).showToast();
      }
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
        {/* <span>Nueva categoria</span> */}
      </div>

      <input
        type="file"
        name="imagesForUpload"
        onChange={handleOnChange}
        placeholder="imagenes"
        value={data.imagesForUpload}
        accept="image/*"
        multiple
      />
      {!isLoading && (
        <button
          type="submit"
          className=" bg-blue-600 hover:bg-blue-700 font-bold text-blue-50 px-2 py-1 rounded-md w-full self-center"
        >
          Subir
        </button>
      )}
      {isLoading && <span>"Subiendo, por favor espere..."</span>}
    </form>
  );
}
