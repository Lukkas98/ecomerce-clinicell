"use client";

import { logAdmin } from "@/lib/actions";
import { useState, useTransition } from "react";
import Swal from "sweetalert2";

export default function LoginAdmin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, startTransition] = useTransition(false);

  const handleOnSubmit = async (e) => {
    try {
      startTransition(
        await logAdmin(e),
        Swal.fire({
          title: "Bienvenido",
          text: "Entrando al panel",
          icon: "success",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
          position: "top",
        })
      );
    } catch (error) {
      Swal.fire({
        title: "Ocurrio un error",
        text: error.message,
        icon: "error",
        toast: true,
        position: "top",
      });
    }
  };

  return (
    <section className="flex justify-center items-center mt-10">
      <div className="border p-5 bg-teal-100 rounded-lg shadow-black shadow-md w-[90%] max-w-xl mx-auto">
        <h4 className="text-xl text-center font-semibold">
          Panel de Administrador
        </h4>
        <form
          action={handleOnSubmit}
          className="mt-8 mb-2 w-full flex flex-col gap-4"
        >
          <label className="w-full">
            Email
            <input
              onChange={(e) => {
                setUser(e.target.value);
              }}
              name="user"
              type="text"
              placeholder="admin user"
              className="w-full border-t-blue-400 block focus:border-t-gray-900 px-2 py-1 mt-3"
            />
          </label>
          <label className="w-full">
            Contraseña
            <input
              onChange={(e) => {
                setPass(e.target.value);
              }}
              name="pass"
              type="password"
              placeholder="********"
              className="w-full border-t-blue-400 block focus:border-t-gray-900 px-2 py-1 mt-3"
            />
          </label>

          {pass && user && (
            <button
              type="submit"
              className="mt-6 px-2 py-1 w-full bg-green-300 rounded-lg"
            >
              {loading ? "Entrando" : "Entrar"}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
