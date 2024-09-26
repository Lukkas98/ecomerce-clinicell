"use client";

import { createPay } from "@/lib/actions/payments";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ButtonPay({ isMobile, data, dispatch, whatsappLink }) {
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
        background: "#374151",
        color: "#E5E7EB",
        preConfirm: async () => {
          try {
            const response = await createPay({
              orderId,
              items,
              total,
            });

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
            html: `<div class="bg-gray-700 rounded-lg p-6 text-center">
    <h6 class="text-xl font-semibold text-gray-300 mb-4">Muchas gracias por confiar en Clinic-Cell</h6>
    <p class="text-green-700 italic font-semibold">${res.value.message}</p>
    <p class="text-gray-300 mb-4">Volviendo a la página principal, por favor, espere...</p>
  </div>`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            allowOutsideClick: false,
            background: "#374151",
            color: "#E5E7EB",
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
            background: "#374151",
            color: "#E5E7EB",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "question",
        title: "¿Confirmas la compra?",
        showConfirmButton: true,
        confirmButtonText: "Si",
        showDenyButton: true,
        denyButtonText: "No",
        showLoaderOnConfirm: true,
        background: "#374151",
        color: "#E5E7EB",
        preConfirm: async () => {
          try {
            const response = await createPay(
              { orderId, items, total },
              whatsappLink
            );

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
            html: `<div class="bg-gray-700 rounded-lg p-6 text-center">
    <h6 class="text-xl font-semibold text-gray-300 mb-4">Muchas gracias por confiar en Clinic-Cell</h6>
    <p class="text-green-700 italic font-semibold">${res.value.message}</p>
    <p class="text-gray-300 mb-4">Redirigiendo a WhatsApp, por favor, espere...</p>
  </div>`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            allowOutsideClick: false,
            background: "#374151",
            color: "#E5E7EB",
            willClose: () => {
              router.replace(res.value.link);
            },
          });
        }
      });
    }
  };

  return (
    <button
      onClick={handleConfirmClick}
      className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
    >
      {isMobile ? "✅ Completar compra" : "✅ Ya mandé el WhatsApp"}
    </button>
  );
}
