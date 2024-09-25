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
      className={`flex items-center justify-center gap-3 px-2 py-1 rounded-md font-semibold ${
        item.stock ? "bg-green-500" : "bg-red-500 text-white"
      }`}
    >
      <p className="">{item.stock ? "En stock" : "Sin stock"}</p>
      <input
        type="checkbox"
        checked={item.stock}
        onChange={handleStockChange}
        className="inline-block"
      />
    </div>
  );
}
