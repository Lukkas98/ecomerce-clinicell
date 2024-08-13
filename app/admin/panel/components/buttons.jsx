"use client";

import { deleteProduct } from "@/lib/actions/products";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Toastify from "toastify-js";

export default function Buttons({ itemId }) {
  const handleEdit = (productId) => {
    Toastify({
      text: "no hace nada, todavia",
      className: "success",
      gravity: "top",
      position: "center",
      duration: 3000,
    }).showToast();
  };

  const handleDelete = async (productId) => {
    const response = await deleteProduct(productId);
    Toastify({
      text: response.message,
      className: "success",
      gravity: "top",
      position: "center",
      duration: 3000,
    }).showToast();
  };

  return (
    <div className="flex space-x-2">
      <button
        className="hover:text-red-800 text-red-500 font-bold py-2 px-4 rounded"
        onClick={() => handleDelete(itemId)}
        title="Eliminar producto"
      >
        <TrashIcon className="h-5 w-5 inline-block" />
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-teal-50 font-bold py-2 px-4 rounded"
        onClick={() => handleEdit(itemId)}
        title="Editar producto"
      >
        <PencilSquareIcon className="h-5 w-5 inline-block" />
      </button>
    </div>
  );
}
