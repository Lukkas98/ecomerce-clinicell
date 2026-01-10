"use client";
import { createPay } from "@/lib/actions/payments";
import { changeUnits } from "@/lib/actions/products";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const updateStock = async function name(items) {
  const changeUnitsItems = items.map(async (item) => {
    return await changeUnits(item._id, item.units - item.unitsInCart);
  });
  await Promise.all(changeUnitsItems).then((responses) => {
    responses.forEach((response) => {
      if (!response.success) {
        console.error(`Error: ${response.message}`);
      }
    });
  });
};

export default function ButtonPay({ isMobile, data, dispatch, whatsappLink }) {
  const { orderId, cart } = data;
  const router = useRouter();

  const handleConfirmClick = () => {
    const total = cart.items.reduce(
      (acc, item) => (acc += item.price * item.unitsInCart),
      0,
    );
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

            await updateStock(items);
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
              whatsappLink,
            );

            if (!response.success)
              return Swal.showValidationMessage(response.message);

            await updateStock(items);
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
      className="focus:ring-opacity-75 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      {isMobile ? "✅ Completar compra" : "✅ Ya mandé el WhatsApp"}
    </button>
  );
}
