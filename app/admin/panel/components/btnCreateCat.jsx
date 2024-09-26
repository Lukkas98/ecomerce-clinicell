"use client";
import { createCategory } from "@/lib/actions/categories";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 2000,
  timerProgressBar: true,
  showConfirmButton: false,
  background: "#374151",
  color: "#E5E7EB",
});

export default function BtnCreateCategory() {
  const handleOnClick = async () => {
    const { value: categoryName } = await Swal.fire({
      title: "Crear Categoría",
      input: "text",
      inputLabel: "Ingresa el nombre de la Categoría nueva",
      showCancelButton: true,
      background: "#374151",
      color: "#E5E7EB",
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

        Toast.fire("Categoría Creada", response.message, "success");
      } catch (error) {
        Toast.fire("Ups..", error.message, "error");
      }
    }
  };
  return (
    <div
      className="px-4 py-3 bg-gray-800 max-w-xl w-[90%] mx-5 md:mx-auto bg-opacity-75 rounded-lg border-2 border-dashed border-gray-600
               hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all flex items-center justify-center md:col-span-2 lg:col-span-3"
    >
      <button
        onClick={handleOnClick}
        className="font-semibold text-lg text-white"
      >
        Crear Categoría
      </button>
    </div>
  );
}
