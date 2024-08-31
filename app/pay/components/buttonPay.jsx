"use client";

import { createPay } from "@/lib/actions/payments";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ButtonPay({ isMobile, data, dispatch }) {
  const { orderId, cart } = data;
  const router = useRouter();

  const handleConfirmClick = () => {
    const total = cart.items.reduce((acc, item) => (acc += item.price), 0);
    const items = cart.items;

    if (!isMobile) {
      Swal.fire({
        icon: "question",
        title: "¿Confirmas que enviaste el mensaje?",
        showConfirmButton: true,
        confirmButtonText: "Si",
        showDenyButton: true,
        denyButtonText: "No",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await createPay({ orderId, items, total });

            if (!response.success)
              return Swal.showValidationMessage(response.message);

            dispatch({ type: "EMPTY_CART" });
            return { message: response.message, link: response.to };
          } catch (error) {
            return Swal.showValidationMessage(`Error: ${error.message}`);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((res) => {
        if (res.isConfirmed) {
          Swal.fire({
            icon: "success",
            html: `<div class="bg-white rounded-lg p-6 text-center">
    <h6 class="text-xl font-semibold text-gray-800 mb-4">Muchas gracias por confiar en Clinic-Cell</h6>
    <p class="text-green-700 font-medium">${res.value.message}</p>
    <p class="text-gray-600 mb-4">Volviendo a la página principal, por favor, espere...</p>
  </div>`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            allowOutsideClick: false,
            willClose: () => {
              router.replace(res.value.link);
            },
          });
        }
        if (res.isDenied) {
          Swal.fire({
            icon: "warning",
            title: "Por favor envía el mensaje primero",
            showConfirmButton: false,
            timer: 1600,
            timerProgressBar: true,
          });
        }
      });
    }
  };

  return (
    <button
      onClick={handleConfirmClick}
      className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
    >
      {isMobile ? "✅ Completar compra" : "✅ Ya mandé el WhatsApp"}
    </button>
  );
}
