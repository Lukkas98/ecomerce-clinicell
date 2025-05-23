"use client";
import { DeleteCategory, editCategory } from "@/lib/actions/categories";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  showConfirmButton: false,
  toast: true,
  position: "top",
  timer: 3000,
  timerProgressBar: true,
  background: "#374151",
  color: "#E5E7EB",
});

export default function Button({ category, subcategories = [] }) {
  const handleDelete = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "¿Quieres eliminar esta Categoría?",
      text: "Todos los productos en esta categoría se borrarán. Si están en otras, también se eliminarán de ellas.",
      showDenyButton: true,
      confirmButtonText: "Si, Borrar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      background: "#374151",
      color: "#E5E7EB",
      preConfirm: async () => {
        try {
          if (subcategories.length)
            return Swal.showValidationMessage(
              "No puedes eliminar una categoría principal con subcategorías"
            );

          const response = await DeleteCategory(id);

          if (!response.success)
            return Swal.showValidationMessage(response.message);

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
      }
    });
  };

  const handleEdit = async (id) => {
    Swal.fire({
      icon: "question",
      title: "¿Quieres Renombrar esta categoria?",
      showDenyButton: true,
      confirmButtonText: "Si, renombrar",
      denyButtonText: `No`,
      background: "#374151",
      color: "#E5E7EB",
    }).then(async (res) => {
      if (res.isConfirmed) {
        const { value: categoryName } = await Swal.fire({
          title: "Editar Categoría",
          input: "text",
          inputLabel: "Ingresa el nombre nuevo",
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
            const capitalName =
              categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
            const response = await editCategory(id, capitalName);

            if (!response.success) throw new Error(response.message);

            Toast.fire(response.message, "", "success");
          } catch (error) {
            Toast.fire("Ups..", error.message, "error");
          }
        }
      }
    });
  };

  return (
    <div
      className={
        subcategories.length
          ? " scale-110 bg-blue-950 px-2 py-1 rounded-lg"
          : "flex items-center space-x-2"
      }
    >
      <button
        onClick={() => handleEdit(category._id)}
        title="Editar"
        className="text-green-400 font-bold p-2 rounded group hover:bg-green-600 transition-all duration-[400ms]"
      >
        <PencilSquareIcon
          width={20}
          height={20}
          className="inline-block group-hover:text-green-400 group-hover:scale-110"
        />
      </button>
      <button
        className="text-red-400 font-bold p-2 rounded group hover:bg-red-600 hover:text-white transition-all duration-[400ms]"
        onClick={() => handleDelete(category._id)}
        title="Eliminar"
      >
        <TrashIcon
          width={20}
          height={20}
          className="inline-block group-hover:text-red-400 group-hover:scale-110"
        />
      </button>
    </div>
  );
}
