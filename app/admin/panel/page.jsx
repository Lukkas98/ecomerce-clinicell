import { getCategories } from "@/lib/actions/categories";
import { getAllPayments } from "@/lib/actions/payments";
import Link from "next/link";
import PaymentsTab from "./components/tabs/paymentsTab";
import ProductsTab from "./components/tabs/productsTab";
import CategoriesTab from "./components/tabs/Categories/categoriesTab";
import AdminSearch from "@/components/adminSearch";

import { FaBoxOpen, FaTags, FaCreditCard } from "react-icons/fa";
import { HiOutlinePlus } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";

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
            page,
          );

  return (
    <div className="relative grid bg-gray-800 text-white">
      {/* Notificación de pagos pendientes */}

      {(!tab || tab === "products") && (
        <header className="fixed top-0 z-10 flex w-full flex-col items-center gap-2 bg-gray-800 px-4 py-2">
          {pendingPayments.length > 0 && (
            <div className="z-50 flex w-full items-center justify-center gap-2 bg-amber-600 p-2 text-sm text-white">
              <CgDanger className="h-5 w-5" />
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
            <AdminSearch className="w-full rounded-lg bg-gray-700 p-2 text-white focus:border-transparent focus:ring-2 focus:ring-blue-500" />
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
        {tab === "restock" && (
          <div className="text-center text-gray-400">
            <p className="text-lg font-semibold">Reingresos 🧠</p>
            <p className="mt-2">
              Tranquilo, está en la lista de cosas por hacer. <br />
              Justo después de colonizar Marte.
            </p>
          </div>
        )}
      </main>

      <Link
        href={"/admin/panel/create"}
        className="fixed right-2 bottom-17 z-10 rounded-full bg-blue-600 p-3 text-white shadow-xl transition-all hover:bg-blue-700"
      >
        <HiOutlinePlus className="h-6 w-6" />
      </Link>

      <nav className="fixed bottom-0 flex w-full justify-around border-t border-gray-700 bg-gray-800 px-1 py-3">
        {[
          { tab: "products", label: "Productos", Icon: <FaBoxOpen /> },
          { tab: "categories", label: "Categorías", Icon: <FaTags /> },
          { tab: "payments", label: "Pedidos", Icon: <FaCreditCard /> },
          // {
          //   tab: "restock",
          //   label: "Reingresos",
          //   Icon: <FaBox />,
          // },
        ].map((tabButton, i) => (
          <TabButton
            key={i}
            active={tab === tabButton.tab || (!tab && i === 0)}
            label={tabButton.label}
            pending={tabButton.tab === "payments" && pendingPayments.length > 0}
            link={`/admin/panel?tab=${tabButton.tab}`}
            icon={tabButton.Icon}
          />
        ))}
      </nav>
    </div>
  );
}

const TabButton = ({ active, label, link, pending, icon }) => (
  <Link
    href={link}
    className={`relative flex flex-col items-center justify-center rounded-md px-2 py-1 text-sm font-semibold transition-all ${
      active
        ? "bg-gray-700/50 text-blue-400"
        : "text-gray-400 hover:text-blue-300"
    }`}
  >
    {icon}
    {label}
    {pending && (
      <span className="absolute -top-1 right-3 h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
    )}
  </Link>
);
