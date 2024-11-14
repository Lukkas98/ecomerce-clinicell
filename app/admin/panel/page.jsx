import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getAllPayments } from "@/lib/actions/payments";
import Link from "next/link";
import PaymentsTab from "./components/tabs/paymentsTab";
import ProductsTab from "./components/tabs/productsTab";
import CategoriesTab from "./components/tabs/categoriesTab";
import InputSearch from "@/components/inputSearch";
import AdminFilter from "./components/filterAdmin";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function AdminPanel(props) {
  const searchParams = await props.searchParams;
  const { tab, page, search, filter } = searchParams;
  const data =
    tab === "categories"
      ? await getCategories()
      : tab === "payments"
      ? await getAllPayments()
      : await getProducts(search, page, filter, null, 8, true);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="px-4 py-2 bg-gray-800 fixed top-0 w-full z-10 flex flex-col items-center space-y-2">
        {!tab || tab === "products" ? (
          <>
            <InputSearch isAdmin={true} />
            <AdminFilter />
          </>
        ) : (
          <p className="h-fit py-2 text-center text-base below-320:text-sm text-gray-400">
            No se puede buscar ni filtrar en esta pestaña, todavia 😉
          </p>
        )}
      </header>
      <main
        className={`flex-1 overflow-auto p-4 ${
          tab === "products" || !tab ? "mt-32" : "mt-12"
        }`}
      >
        {(!tab || tab === "products") && <ProductsTab data={data} />}

        {tab === "categories" && <CategoriesTab data={data} />}

        {tab === "payments" && <PaymentsTab data={data} />}
      </main>
      <Link
        href={"/admin/panel/create"}
        className="bg-blue-600 text-white p-3 text-lg rounded-full fixed bottom-20 right-5 shadow-lg hover:bg-blue-700 transition"
      >
        <PlusIcon width={20} height={20} />
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
