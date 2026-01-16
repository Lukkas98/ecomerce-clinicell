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
    <div className="flex h-full flex-col justify-center gap-1 bg-gray-800 px-1">
      <button
        className="group flex w-fit justify-between rounded bg-red-800 p-2 text-teal-100 transition-all"
        onClick={() => handleDelete(itemId)}
        title="Eliminar producto"
      >
        <TrashIcon className="inline-block h-5 w-5 group-hover:scale-[1.20]" />
      </button>
      <button
        className="group flex w-fit justify-center rounded bg-green-700 p-2 text-teal-100 transition-all"
        onClick={() => handleEdit(itemId)}
        title="Editar producto"
      >
        <PencilSquareIcon className="inline-block h-5 w-5 group-hover:scale-[1.20]" />
      </button>
    </div>
  );
}
