"use client";
import { approvePay, deletePay } from "@/lib/actions/payments";
import {
  CheckIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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

export default function BtnPayment({ approved, payment }) {
  const handleOnClick = () => {
    Swal.fire({
      icon: "question",
      title: `¿Aprobar Orden?`,
      html: `<div class="p-4 bg-gray-800 rounded-xl">
         <h2 class="text-lg font-semibold text-gray-200">${payment.id}</h2>
         <p class="mt-2 text-gray-400">Productos: ${payment.items.length}</p>
         <p class="text-gray-400">Total: $${payment.total}</p>
         <p class="mt-4 text-sm text-gray-300 italic">
           Una vez aprobada se eliminará a los 7 días
         </p>
       </div>`,
      showDenyButton: true,
      confirmButtonText: "Si, aprobar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      background: "#374151",
      color: "#E5E7EB",
      preConfirm: async () => {
        try {
          const response = await approvePay(payment.id);

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

  const handleDelete = async () => {
    Swal.fire({
      icon: "question",
      title: `¿Eliminar Orden ${payment.id}?`,
      text: "Esta acción es irreversible",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      background: "#374151",
      color: "#E5E7EB",
      preConfirm: async () => {
        try {
          const response = await deletePay(payment._id);

          if (!response.success)
            return Swal.showValidationMessage(response.message);

          return response.message;
        } catch (error) {
          return Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Toast.fire({
          icon: "success",
          title: result.value,
        });
      }
    });
  };

  return (
    <>
      {approved ? (
        <>
          <CheckIcon width={40} height={40} className="text-green-400" />
        </>
      ) : (
        <div className="flex flex-col gap-2 relative justify-center items-center">
          <TrashIcon
            width={20}
            height={20}
            className="text-red-500 hover:text-red-700 hover:scale-125 transition-all
            absolute -top-3 -right-2"
            onClick={handleDelete}
          />
          <ExclamationCircleIcon
            width={40}
            height={40}
            className="text-orange-500 mt-4"
          />
          <button
            onClick={handleOnClick}
            className="px-2 py-1 text-white bg-green-800 rounded-md shadow-black shadow-sm hover:bg-green-900 transition-all"
          >
            Aprobar
          </button>
        </div>
      )}
    </>
  );
}
