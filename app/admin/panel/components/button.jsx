"use client";
import { DeleteCategory } from "@/lib/actions/categories";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  showConfirmButton: false,
  toast: true,
  position: "top",
  timer: 3000,
  timerProgressBar: true,
});

export default function Button({ categoryId }) {
  const handleDelete = async (id) => {
    Swal.fire({
      icon: "warning",
      title: "¿Quieres eliminar esta categoria?",
      text: "Todos los productos en esta categoria se borrarán",
      showDenyButton: true,
      confirmButtonText: "Si, Borrar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      preConfirm: async () => {
        try {
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
    <div className="flex space-x-2">
      <button
        className="text-red-500 font-bold py-2 px-4 rounded group hover:bg-red-500 transition-all duration-[400ms]"
        onClick={() => handleDelete(categoryId)}
        title="Eliminar Categoria"
      >
        <TrashIcon className="h-5 w-5 inline-block group-hover:text-red-200 group-hover:scale-[1.20]" />
      </button>
    </div>
  );
}
