import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getAllPayments } from "@/lib/actions/payments";
import Buttons from "./components/buttons";
import BtnPayment from "./components/btnPayment";
import CheckboxStock from "./components/checkboxStock";
import Button from "./components/button";
import Link from "next/link";
import Image from "next/image";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function AdminPanel({ searchParams }) {
  const { tab } = searchParams;
  const data =
    tab === "categories"
      ? await getCategories()
      : tab === "payments"
      ? await getAllPayments()
      : await getProducts();

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
          <Link
            className="bg-blue-300 text-black px-2 py-1 rounded shadow-black shadow-sm hover:bg-blue-700 hover:text-white transition-all"
            href={"/admin/panel?tab=payments"}
          >
            Pedidos
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
               hover:bg-blue-400 hover:text-black transition-all flex justify-between"
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

      {tab === "payments" && (
        <main className="my-4 mx-2">
          {["Pedidos no aprobados", "Pedidos aprobados"].map((title, index) => (
            <details className="mb-6" key={index} open={!index}>
              <summary className="font-semibold text-xl cursor-pointer">
                {title}
              </summary>
              <div className="grid gap-3 mt-4 md:grid-cols-2 lg:grid-cols-3">
                {data
                  ?.filter((payment) => payment.approved === !!index)
                  .map((payment, i) => (
                    <div
                      className={`${
                        payment.approved
                          ? "bg-green-300 hover:bg-green-400"
                          : "bg-orange-300 hover:bg-orange-400 hover:text-black"
                      } px-3 py-2 max-w-xl mx-5 rounded-lg shadow-black shadow transition-all flex justify-between items-center`}
                      key={i}
                    >
                      <div className="mb-3">
                        <p className="font-semibold text-lg">{payment.id}</p>
                        <p className="text-sm">
                          Productos: {payment.items.length}
                        </p>
                        <p className="text-sm mt-2">
                          Total:{" "}
                          <span className="font-semibold text-base">
                            ${payment.total}
                          </span>
                        </p>
                        <p>
                          {new Date(payment.updatedAt).toLocaleString("es-AR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {payment.approved && (
                            <span className="text-base inline-block font-bold">
                              Se eliminará automáticamente después de 7 días
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 justify-center items-center">
                        <BtnPayment
                          approved={payment.approved}
                          payment={JSON.parse(JSON.stringify(payment))}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </details>
          ))}
        </main>
      )}
    </div>
  );
}
