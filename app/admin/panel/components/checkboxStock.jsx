"use client";
import { changeStock } from "@/lib/actions/products";
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

export default function CheckboxStock({ item }) {
  const handleStockChange = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de cambiar el stock de ${item.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiarlo",
      cancelButtonText: "Cancelar",
      background: "#374151",
      color: "#E5E7EB",
    });

    if (result.isConfirmed) {
      try {
        const response = await changeStock(item._id, item.stock);

        if (!response.success) throw new Error(response.message);

        Toast.fire("¡Cambiado!", response.message, "success");
      } catch (error) {
        Toast.fire("¡Ups..!", response.message, "error");
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center text-white gap-3 rounded-md h-fit px-2 py-1 ${
        item.stock ? "bg-green-800" : "bg-red-800"
      }`}
    >
      <p className="whitespace-nowrap">
        {item.stock ? "En stock" : "Sin stock"}
      </p>
      <input
        type="checkbox"
        checked={item.stock}
        onChange={handleStockChange}
        className="inline-block"
      />
    </div>
  );
}
