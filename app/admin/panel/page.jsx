import { getProducts } from "@/lib/actions/products";
import Buttons from "./components/buttons";
import Link from "next/link";
import Image from "next/image";

export default async function AdminPanel() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-700 text-white py-4 px-6 flex justify-between">
        <h2 className="text-xl">Panel de Administrador</h2>
        <Link
          className="py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded-md transition-all"
          href={"/admin/panel/create"}
        >
          Create Product
        </Link>
      </header>

      <main className="flex-1 p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((item, i) => (
          <div
            key={i}
            className="border border-gray-300 p-4 rounded-lg bg-white flex justify-between items-center"
          >
            <div className="w-[50%]">
              <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
              <div className="relative w-10 aspect-square overflow-hidden rounded-md">
                <Image
                  src={item.images[0]}
                  fill={true}
                  alt={item.name + "image"}
                  sizes="40px"
                />
              </div>
              <div className="flex w-full justify-between pt-4">
                <p className="text-gray-600">$ {item.price}</p>
                <p className="text-gray-600">
                  {item.stock ? "en stock" : "sin stock"}
                </p>
              </div>
            </div>
            <Buttons itemId={item._id.toString()} />
          </div>
        ))}
      </main>
    </div>
  );
}
