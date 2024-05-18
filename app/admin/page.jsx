"use client";

import { logAdmin } from "@/lib/actions";
import { useState } from "react";

export default function LoginAdmin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <section className="flex justify-center items-center mt-10">
      <div className="border p-5 bg-teal-100 rounded-lg shadow-black shadow-md">
        <h4 className=" text-xl text-center font-semibold">
          Panel de Administrador
        </h4>
        <form
          action={logAdmin}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4"
        >
          <label className="w-full">
            Usuario
            <input
              onChange={(e) => {
                setUser(e.target.value);
              }}
              name="user"
              type="text"
              placeholder="example"
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
              Entrar
            </button>
          )}
        </form>
      </div>
    </section>
  );
}