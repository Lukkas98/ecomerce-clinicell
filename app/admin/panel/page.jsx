import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import Buttons from "./components/buttons";
import Link from "next/link";
import Image from "next/image";
import CheckboxStock from "./components/checkboxStock";
import Button from "./components/button";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function AdminPanel({ searchParams }) {
  const { tab } = searchParams;
  const data =
    tab === "categories" ? await getCategories() : await getProducts();

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      <nav className="bg-blue-700 text-white py-4 px-6 grid grid-cols-2 place-items-center gap-y-4">
        <h2 className="text-xl">Panel de Administrador</h2>
        <Link
          className="py-2 px-3 bg-blue-500 hover:bg-blue-800 rounded-md transition-all"
          href={"/admin/panel/create"}
        >
          Crear Producto
        </Link>
        <div className="col-span-2 flex gap-5">
          <Link
            className="bg-blue-300 text-black px-2 py-1 rounded shadow-black shadow-sm hover:bg-blue-700 hover:text-white transition-all"
            href={"/admin/panel?tab=products"}
          >
            Productos
          </Link>
          <Link
            className="bg-blue-300 text-black px-2 py-1 rounded shadow-black shadow-sm hover:bg-blue-700 hover:text-white transition-all"
            href={"/admin/panel?tab=categories"}
          >
            Categorías
          </Link>
        </div>
      </nav>

      {(!tab || tab === "products") && (
        <main className="flex-1 p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((item, i) => (
            <div
              key={i}
              className="border border-gray-300 h-fit p-4 rounded-lg bg-teal-50 flex justify-between items-center shadow-black shadow-md"
            >
              <div className="w-[50%]">
                <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                <div
                  className={`aspect-square relative w-24 overflow-hidden rounded-md ${
                    item.images[0] ? "shadow-black shadow" : ""
                  }`}
                >
                  <Image
                    src={item.images[0] || noImage}
                    alt={item.name + "image"}
                    fill={true}
                    sizes="96px"
                    quality={80}
                  />
                </div>
                <div className="flex w-full justify-between pt-4">
                  <p className="text-gray-600">$ {item.price}</p>
                  <div className="flex gap-3 items-center">
                    <CheckboxStock item={JSON.parse(JSON.stringify(item))} />
                  </div>
                </div>
              </div>
              <Buttons itemId={item._id.toString()} />
            </div>
          ))}
        </main>
      )}

      {tab === "categories" && (
        <main className="grid gap-4 my-4 md:grid-cols-2 lg:grid-cols-4">
          {data?.map((cat, i) => (
            <div
              className="px-3 py-2 max-w-xl bg-teal-50 mx-5 rounded-lg shadow-black shadow
               hover:bg-blue-400 hover:text-black transition-all"
              key={i}
            >
              <div className="mb-3">
                <p className="font-semibold text-lg">{cat.name}</p>
                <p className="text-sm">Productos: {cat.products.length}</p>
              </div>
              <Button categoryId={JSON.parse(JSON.stringify(cat._id))} />
            </div>
          ))}
        </main>
      )}
    </div>
  );
}
