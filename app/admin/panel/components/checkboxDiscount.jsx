"use client";
import { changeDiscount } from "@/lib/actions/products";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  timer: 2000,
  position: "top",
  timerProgressBar: true,
  showConfirmButton: false,
  background: "#374151",
  color: "#E5E7EB",
});

export default function CheckboxDiscount({ item }) {
  const handleDiscount = async () => {
    if (item.discount) {
      // Confirmar y quitar descuento
      const { isConfirmed } = await Swal.fire({
        title: "¿Quitar oferta?",
        text: `Se quitará el descuento de ${item.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, quitar",
        cancelButtonText: "Cancelar",
        background: "#374151",
        color: "#E5E7EB",
      });
      if (!isConfirmed) return;

      try {
        const res = await changeDiscount(item._id, 0);
        if (!res.success) throw new Error(res.message);
        Toast.fire({ icon: "success", title: res.message });
      } catch (err) {
        Toast.fire({
          icon: "error",
          title: err.message || "Error desconocido",
        });
      }
    } else {
      // Pedir nuevo precio de oferta
      const { value: newPrice } = await Swal.fire({
        title: `Oferta para ${item.name}`,
        input: "number",
        inputLabel: "Precio con descuento",
        inputValue: item.price,
        showCancelButton: true,
        background: "#374151",
        color: "#E5E7EB",
      });
      if (!newPrice) return;

      try {
        if (Number(newPrice) >= item.price) {
          Toast.fire({
            icon: "error",
            title: "El precio con descuento debe ser menor al precio original",
          });
          return;
        }

        const res = await changeDiscount(item._id, Number(newPrice));
        if (!res.success) throw new Error(res.message);
        Toast.fire({ icon: "success", title: res.message });
      } catch (err) {
        Toast.fire({
          icon: "error",
          title: err.message || "Error desconocido",
        });
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center text-white gap-3 rounded-md h-fit px-2 py-1 ${
        item.discount ? "bg-blue-800/50" : "bg-gray-500/50"
      }`}
    >
      <p className="whitespace-nowrap">Oferta</p>
      <input
        type="checkbox"
        checked={!!item.discount}
        onChange={handleDiscount}
        className="inline-block"
      />
    </div>
  );
}
