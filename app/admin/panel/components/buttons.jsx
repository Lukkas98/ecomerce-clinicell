"use client";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Buttons({ itemId }) {
  const handleEdit = (productId) => {
    // Lógica para editar el producto con el id productId
    console.log(`Editar producto ${productId}`);
  };

  const handleDelete = (productId) => {
    // Lógica para eliminar el producto con el id productId
    console.log(`Eliminar producto ${productId}`);
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
