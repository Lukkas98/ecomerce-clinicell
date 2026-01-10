"use client";
import { approvePay, deletePay, updateStock } from "@/lib/actions/payments";
import { changeUnits } from "@/lib/actions/products";
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
  const totalItems = payment.items.reduce((acc, item) => acc + item.units, 0);
  const handleOnClick = () => {
    Swal.fire({
      icon: "question",
      title: `¿Aprobar Orden?`,
      html: `<div class="p-4 bg-gray-800 rounded-xl">
         <h2 class="text-lg font-semibold text-gray-200">${payment.id}</h2>
         <p class="mt-2 text-gray-400">Productos: ${totalItems}</p>
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
      text: "Esta acción es irreversible, el stock de los productos será actualizado.",
      showDenyButton: true,
      confirmButtonText: "Si, Eliminar y Actualizar",
      showLoaderOnConfirm: true,
      denyButtonText: `No`,
      background: "#374151",
      color: "#E5E7EB",
      preConfirm: async () => {
        try {
          await updateStock(payment.items, payment);
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
        <div className="relative flex flex-col items-center justify-center gap-2">
          <TrashIcon
            width={20}
            height={20}
            className="absolute -top-3 -right-2 text-red-500 transition-all hover:scale-125 hover:text-red-700"
            onClick={handleDelete}
          />
          <ExclamationCircleIcon
            width={40}
            height={40}
            className="mt-4 text-orange-500"
          />
          <button
            onClick={handleOnClick}
            className="rounded-md bg-green-800 px-2 py-1 text-white shadow-sm shadow-black transition-all hover:bg-green-900"
          >
            Aprobar
          </button>
        </div>
      )}
    </>
  );
}
