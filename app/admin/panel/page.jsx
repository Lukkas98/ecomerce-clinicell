import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getAllPayments } from "@/lib/actions/payments";
import Link from "next/link";
import ProductsTab from "./components/productsTab";
import CategoriesTab from "./components/categoriesTab";
import PaymentsTab from "./components/paymentsTab";

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
          Subir Producto
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

      {(!tab || tab === "products") && <ProductsTab data={data} />}

      {tab === "categories" && <CategoriesTab data={data} />}

      {tab === "payments" && <PaymentsTab data={data} />}
    </div>
  );
}
