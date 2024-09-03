"use client";
import { createCategory } from "@/lib/actions/categories";
import Swal from "sweetalert2";

export default function BtnCreateCategory() {
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
  return (
    <div
      className="px-3 py-2 bg-blue-200 max-w-xl w-[90%] mx-5 md:mx-auto bg-opacity-75 rounded-lg border-2 border-dashed border-blue-500
               hover:bg-blue-400 hover:text-black hover:border-black transition-all flex items-center justify-center md:col-span-2 lg:col-span-4"
    >
      <button onClick={handleOnClick} className="font-semibold text-lg">
        Crear Categoría
      </button>
    </div>
  );
}
