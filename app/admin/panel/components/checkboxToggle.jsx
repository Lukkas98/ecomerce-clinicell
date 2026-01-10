"use client";
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

export default function CheckboxToggle({
  item,
  field, //"stock", "outlet"
  actionFn, //changeStock, ChangeOutlet
  confirmOptions, // { title, getText: name=>string }
  onLabel, // etiqueta cuando item[field]===true
  offLabel, // etiqueta cuando false
  onClass, // bg-color cuando true
  offClass, // bg-color cuando false
}) {
  const current = item[field];

  const handleChange = async () => {
    const { isConfirmed } = await Swal.fire({
      title: confirmOptions.title,
      text: confirmOptions.getText(item.name, current),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiarlo",
      cancelButtonText: "Cancelar",
      background: "#374151",
      color: "#E5E7EB",
    });
    if (!isConfirmed) return;

    try {
      const res = await actionFn(item._id, current);
      if (!res.success) throw new Error(res.message);
      Toast.fire("¡Cambiado!", res.message, "success");
    } catch (err) {
      Toast.fire("¡Ups..!", err.message || "Error desconocido", "error");
    }
  };

  return (
    <div
      className={`flex h-fit items-center justify-center gap-3 rounded-md px-2 py-1 text-white ${
        current ? onClass : offClass
      }`}
    >
      <p className="whitespace-nowrap">{current ? onLabel : offLabel}</p>
      <input
        type="checkbox"
        checked={current}
        onChange={handleChange}
        className="inline-block"
      />
    </div>
  );
}
