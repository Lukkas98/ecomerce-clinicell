"use client";
import { ChangeOutlet } from "@/lib/actions/products";
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

export default function CheckboxOutlet({ item }) {
  const handleOutletChange = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de cambiar el estado de ${item.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiarlo",
      cancelButtonText: "Cancelar",
      background: "#374151",
      color: "#E5E7EB",
    });

    if (result.isConfirmed) {
      try {
        const response = await ChangeOutlet(item._id, item.outlet);

        if (!response.success) throw new Error(response.message);

        Toast.fire("¡Cambiado!", response.message, "success");
      } catch (error) {
        Toast.fire("¡Ups..!", response.message, "error");
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center text-white gap-3 px-1 py-0.5 col-span-2 rounded-md font-semibold ${
        item.outlet ? "bg-red-900" : "bg-green-900"
      }`}
    >
      <p className="">{item.outlet ? "Outlet" : "En buen Estado"}</p>
      <input
        type="checkbox"
        checked={item.outlet}
        onChange={handleOutletChange}
        className="inline-block"
      />
    </div>
  );
}
