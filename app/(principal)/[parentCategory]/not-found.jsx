import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-5 text-gray-300">
      <h2 className="mb-2 text-4xl font-extrabold">404 Ups...</h2>
      <p className="mb-6 text-center text-lg text-gray-300">
        Lo sentimos, no pudimos encontrar el recurso que buscabas.
      </p>
      <Link
        href="/"
        className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
