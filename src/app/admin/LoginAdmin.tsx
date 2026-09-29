"use client";

import { logAdmin } from "@/lib/actions/auth";
import { useActionState } from "react";

export default function LoginAdmin() {
  const [state, formAction, isPending] = useActionState(logAdmin, null);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <section className="dashboard-card w-full max-w-md p-6 sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <AdminIcon />
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-blue-600 uppercase">
            Clinicell
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Panel de administrador
          </h1>
        </div>

        <form action={formAction} className="mt-7 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Usuario
            </span>
            <input
              autoComplete="username"
              autoFocus
              className="form-input"
              name="user"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Contraseña
            </span>
            <input
              autoComplete="current-password"
              className="form-input"
              name="pass"
              required
              type="password"
            />
          </label>

          {state?.message ? (
            <p
              aria-live="polite"
              className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
              role="alert"
            >
              {state.message}
            </p>
          ) : null}

          <button
            className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
                Verificando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </section>
    </main>
  );
}

function AdminIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="26"
      viewBox="0 0 24 24"
      width="26"
    >
      <rect
        height="9"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        width="9"
        x="7.5"
        y="3"
      />
      <path
        d="M4 21v-1.5a8 8 0 0 1 16 0V21H4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
