"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { createCategory } from "@/lib/actions/categories";
import Swal from "sweetalert2";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 1800,
  timerProgressBar: true,
  showConfirmButton: false,
  background: "#374151",
  color: "#E5E7EB",
});

export default function BtnCreateCategory({ categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("parent"); // 'parent' | 'child'
  const [parentCategory, setParentCategory] = useState("");
  const [state, formAction, isPending] = useActionState(createCategory, null);

  const handleOpen = (type) => {
    setMode(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setParentCategory("");
  };

  useEffect(() => {
    if (state?.message) {
      Toast.fire({
        icon: state.success ? "success" : "error",
        title: state.success ? "Creada" : "Error",
        text: state.message,
        didClose: closeModal,
      });
    }
  }, [state]);

  return (
    <>
      <div className="mx-auto flex w-[90%] max-w-xl gap-4">
        <CategoryButton
          onClick={() => handleOpen("parent")}
          label="Crear Principal"
          colorClass="bg-blue-600 hover:bg-blue-700"
        />

        <CategoryButton
          onClick={() => handleOpen("child")}
          label="Crear Subcategoría"
          colorClass="bg-purple-600 hover:bg-purple-700"
        />
      </div>

      {isOpen && (
        <ModalWrapper onClose={closeModal}>
          <form action={formAction} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-100">
              {mode === "parent"
                ? "Nueva Categoría Principal"
                : "Nueva Subcategoría"}
            </h2>

            <input
              name="name"
              placeholder={
                mode === "parent"
                  ? "Nombre categoría principal"
                  : "Nombre de subcategoría"
              }
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-200 placeholder-gray-500 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              onFocus={(e) => {
                setTimeout(() => {
                  document.getElementById("submit-button")?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }, 1500);
              }}
            />

            {mode === "child" && (
              <div className="space-y-2">
                <label className="mb-2 block text-sm text-gray-400">
                  Categoría Padre
                </label>
                <CustomSelect
                  options={categories}
                  value={parentCategory}
                  onChange={setParentCategory}
                  placeholder="Selecciona una categoría"
                />
                <input
                  type="hidden"
                  name="parentCategory"
                  value={parentCategory}
                  onFocus={(e) => {
                    setTimeout(() => {
                      document.getElementById("submit-button")?.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      });
                    }, 1500);
                  }}
                />
              </div>
            )}

            <FormActions
              isPending={isPending}
              onClose={closeModal}
              mode={mode}
            />
            <div id="submit-button"></div>
          </form>
        </ModalWrapper>
      )}
    </>
  );
}

// Componentes auxiliares
const CategoryButton = ({ onClick, label, colorClass }) => (
  <button
    onClick={onClick}
    className={`${colorClass} flex-1 rounded-lg px-6 py-3 text-center text-sm font-medium shadow-md transition-all hover:shadow-lg`}
  >
    {label}
  </button>
);

const ModalWrapper = ({ children, onClose }) => (
  <>
    <div
      onClick={onClose}
      className="bg-opacity-55 fixed inset-0 z-40 bg-black"
    />
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-96 max-w-[95%] rounded-lg bg-gray-800 p-6 text-white">
        {children}
      </div>
    </div>
  </>
);

const FormActions = ({ isPending, onClose, mode }) => (
  <div className="flex justify-end gap-3 border-t border-gray-700 pt-4">
    {isPending ? (
      <div className="text-sm text-gray-400">
        Creando {mode === "parent" ? "categoría" : "subcategoría"}...
      </div>
    ) : (
      <>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
        >
          {mode === "parent" ? "Crear Principal" : "Crear Subcategoría"}
        </button>
      </>
    )}
  </div>
);

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt._id === value);

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border bg-gray-700 px-4 py-2 text-left ${
          isOpen ? "border-blue-500" : "border-gray-600"
        } flex items-center justify-between rounded-md`}
      >
        <span className={value ? "text-gray-200" : "text-gray-400"}>
          {selectedOption?.name || placeholder}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg">
          {options.map((option) => (
            <div
              key={option._id}
              onClick={() => {
                onChange(option._id);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-3 hover:bg-gray-700/50 ${
                value === option._id ? "bg-blue-600/20" : ""
              }`}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
