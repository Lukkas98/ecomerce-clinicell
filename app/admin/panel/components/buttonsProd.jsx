"use client";
import { deleteProduct } from "@/lib/actions/products";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
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

export default function ButtonsProd({ itemId }) {
  const router = useRouter();

  const handleEdit = (productId) => {
    router.push(`/admin/panel/edit?id=${productId}`);
  };

  const handleDelete = async (productId) => {
    Swal.fire({
      icon: "warning",
      title: "¿Quieres eliminar este producto?",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      background: "#374151",
      color: "#E5E7EB",
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
      if (result.isConfirmed) {
        Toast.fire({
          icon: "success",
          title: "Completado",
          text: result.value,
        });
      }
    });
  };

  return (
    <div className="flex space-x-2 col-span-2">
      <button
        className="text-red-500 font-bold py-2 px-4 rounded group hover:bg-red-500 transition-all duration-[400ms]"
        onClick={() => handleDelete(itemId)}
        title="Eliminar producto"
      >
        <TrashIcon className="h-5 w-5 inline-block group-hover:text-red-200 group-hover:scale-[1.20]" />
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-teal-50 font-bold py-2 px-4 rounded flex items-center transition-all group"
        onClick={() => handleEdit(itemId)}
        title="Editar producto"
      >
        <PencilSquareIcon className="h-5 w-5 inline-block group-hover:scale-[1.20]" />
      </button>
    </div>
  );
}
