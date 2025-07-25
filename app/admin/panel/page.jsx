export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/actions/categories";
import { getAllPayments } from "@/lib/actions/payments";
import Link from "next/link";
import PaymentsTab from "./components/tabs/paymentsTab";
import ProductsTab from "./components/tabs/productsTab";
import CategoriesTab from "./components/tabs/Categories/categoriesTab";
import AdminSearch from "@/components/adminSearch";

import { PlusIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { getProductsAdmin } from "@/lib/actions/products";
import AdminFilter from "./components/filter-admin/adminFilter";

export default async function AdminPanel({ searchParams }) {
  const { tab, page, search, stock, discount, outlet } = await searchParams;

  const allPayments = await getAllPayments();
  const pendingPayments = allPayments.filter((payment) => !payment.approved);

  const data =
    tab === "categories"
      ? await getCategories()
      : tab === "payments"
      ? allPayments
      : await getProductsAdmin(
          search,
          {
            sort: "az",
            stock: [stock],
            discount: [discount],
            outlet: [outlet],
          },
          page
        );

  return (
    <div className="grid bg-gray-800 text-white relative">
      {/* Notificación de pagos pendientes */}

      {(!tab || tab === "products") && (
        <header className="px-4 py-2 bg-gray-800 fixed top-0 w-full z-10 flex flex-col items-center gap-2">
          {pendingPayments.length > 0 && (
            <div className="w-full bg-amber-600 text-white z-50 p-2 flex items-center justify-center gap-2 text-sm">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>
                {pendingPayments.length}{" "}
                {pendingPayments.length > 1
                  ? "pagos pendientes"
                  : "pago pendiente"}{" "}
                de aprobación
              </span>
            </div>
          )}
          <div className="flex">
            <AdminSearch className="bg-gray-700 text-white rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <AdminFilter />
          </div>
        </header>
      )}

      <main
        className={`flex-1 overflow-auto p-4 ${
          tab === "products" || !tab
            ? pendingPayments.length
              ? "mt-25"
              : "mt-15"
            : ""
        }`}
      >
        {(!tab || tab === "products") && <ProductsTab data={data} />}
        {tab === "categories" && <CategoriesTab data={data} />}
        {tab === "payments" && <PaymentsTab data={data} />}
      </main>

      <Link
        href={"/admin/panel/create"}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full fixed bottom-15 right-2 shadow-xl transition-all z-10"
      >
        <PlusIcon className="w-6 h-6" />
      </Link>

      <nav className="bg-gray-800 fixed bottom-0 w-full flex justify-around py-3 border-t border-gray-700">
        {[
          { tab: "products", label: "Productos" },
          { tab: "categories", label: "Categorías" },
          { tab: "payments", label: "Pedidos" },
        ].map((tabButton, i) => (
          <TabButton
            key={i}
            active={tab === tabButton.tab}
            label={tabButton.label}
            pending={tabButton.tab === "payments" && pendingPayments.length > 0}
            link={`/admin/panel?tab=${tabButton.tab}`}
          />
        ))}
      </nav>
    </div>
  );
}

const TabButton = ({ active, label, link, pending }) => (
  <Link
    href={link}
    className={`flex flex-col items-center justify-center px-4 py-1 rounded-md transition-all relative ${
      active
        ? "text-blue-400 bg-gray-700/50"
        : "text-gray-400 hover:text-blue-300"
    }`}
  >
    {label}
    {pending && (
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
    )}
  </Link>
);
