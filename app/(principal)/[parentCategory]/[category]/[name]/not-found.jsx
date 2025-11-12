import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-5 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold whitespace-nowrap text-red-600">
          Producto no encontrado
        </h1>
        <p className="text-gray-500">
          Lo sentimos, el producto que estás buscando no existe o ha sido
          eliminado.
        </p>
      </div>
      <Link
        href="/home"
        className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
