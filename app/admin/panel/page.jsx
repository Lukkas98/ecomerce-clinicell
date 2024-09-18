import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getAllPayments } from "@/lib/actions/payments";
import Link from "next/link";
import ProductsTab from "./components/productsTab";
import CategoriesTab from "./components/categoriesTab";
import PaymentsTab from "./components/paymentsTab";
import InputSearch from "@/components/(search)/inputSearch";

export default async function AdminPanel({ searchParams }) {
  const { tab, page, search, filter } = searchParams;
  const data =
    tab === "categories"
      ? await getCategories()
      : tab === "payments"
      ? await getAllPayments()
      : await getProducts(search, page, filter, null);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="px-4 py-2 bg-gray-800 fixed top-0 w-full z-10 flex flex-col items-center space-y-2">
        <InputSearch isAdmin={true} />
        <div className="flex space-x-2">
          <select className="bg-gray-700 text-white rounded-lg p-2 outline-none">
            <option value="">Todos</option>
            <option value="stock">En Stock</option>
            <option value="-stock">Sin Stock</option>
            <option value="high-price">Mayor Precio</option>
            <option value="low-price">Menor Precio</option>
          </select>
        </div>
      </header>
      <main className="flex-1 mt-20 overflow-auto p-4">
        {(!tab || tab === "products") && <ProductsTab data={data} />}

        {tab === "categories" && <CategoriesTab data={data} />}

        {tab === "payments" && <PaymentsTab data={data} />}
      </main>
      <Link
        href={"/admin/panel/create"}
        className="bg-blue-600 text-white px-4 py-2 text-lg rounded-full fixed bottom-20 right-5 shadow-lg hover:bg-blue-700 transition"
      >
        +
      </Link>

      <nav className="bg-gray-800 fixed bottom-0 w-full flex justify-around py-4">
        {[
          { tab: "products", label: "Productos" },
          { tab: "categories", label: "Categorías" },
          { tab: "payments", label: "Pedidos" },
        ].map((tabButton, i) => (
          <TabButton
            key={i}
            active={tab === tabButton.tab}
            label={tabButton.label}
            link={`/admin/panel?tab=${tabButton.tab}`}
          />
        ))}
      </nav>
    </div>
  );
}

const TabButton = ({ active, label, link }) => (
  <Link
    href={link}
    className={`flex flex-col items-center justify-center ${
      active ? "text-blue-400" : "text-gray-400"
    } hover:text-blue-300 transition`}
  >
    {label}
  </Link>
);
