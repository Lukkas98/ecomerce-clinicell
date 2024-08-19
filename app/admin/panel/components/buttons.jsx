"use client";
import { deleteProduct } from "@/lib/actions/products";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const toast = Swal.mixin({
  showConfirmButton: false,
  toast: true,
  position: "top",
  timer: 3000,
  timerProgressBar: true,
});

export default function Buttons({ itemId }) {
  const router = useRouter();

  const handleEdit = (productId) => {
    router.push(`/admin/panel/edit?id=${productId}`);
  };

  const handleDelete = async (productId) => {
    Swal.fire({
      title: "Quieres eliminar este producto?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si, Borrar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      preConfirm: async () => {
        try {
          const response = await deleteProduct(productId);

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
        toast.fire({
          icon: "success",
          title: "Completado",
          text: result.value,
        });

        //boton "No"
      } else if (result.isDenied) {
        toast.fire({
          icon: "info",
          title: "Acción cancelada",
        });
      }
    });
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
