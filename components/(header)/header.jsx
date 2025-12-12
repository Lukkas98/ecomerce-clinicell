import Image from "next/image";
import Link from "next/link";
import Cart from "../cart";
import MegaMenu from "./navMenu/megaMenu";
import MenuMobile from "./navMenu/menuMobile";
import ClientSearch from "./navMenu/(clientInput)/clientSearch";
import { getCategories } from "@/lib/actions/categories";
import { getOffertOutlet } from "@/lib/actions/products";

export default async function Navbar() {
  const categories = await getCategories();
  const boleans = await getOffertOutlet();
  const { hasOutlet, hasOffers } = boleans;

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-gray-800 from-55% to-blue-900 text-white shadow-sm shadow-gray-950">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo Clinic-Cell"
              width={50}
              height={50}
              className="rounded-lg transition-opacity hover:opacity-90"
              priority
            />
          </Link>

          <div>
            <h1 className="text-lg font-bold">Clinic-Cell</h1>
            <p className="text-xs text-gray-400 lg:text-sm">
              Repuestos y Accesorios
            </p>
          </div>
        </div>

        {/* Barra de búsqueda (desktop) */}
        <div className="mx-4 hidden flex-1 lg:block">
          <ClientSearch />
        </div>

        {/* Carrito y menú */}
        <div className="flex items-center gap-6">
          {/* Navegación principal (desktop) */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="text-sm transition-colors hover:text-blue-400"
            >
              Home
            </Link>
            {hasOutlet && (
              <Link
                href="/outlet"
                className="text-sm transition-colors hover:text-blue-400"
              >
                Outlet
              </Link>
            )}
            {hasOffers && (
              <Link
                href="/ofertas"
                className="text-sm transition-colors hover:text-blue-400"
              >
                Ofertas de la semana
              </Link>
            )}

            <MegaMenu dataCategories={JSON.parse(JSON.stringify(categories))} />
          </nav>
          <button className="relative hidden rounded-md p-1 transition-colors hover:bg-gray-800 lg:flex">
            <Cart />
          </button>

          {/* Navegación principal (Mobile) */}
          <MenuMobile
            dataCategories={JSON.parse(JSON.stringify(categories))}
            boleans={boleans}
          >
            <ClientSearch />
          </MenuMobile>
        </div>
      </div>
    </header>
  );
}
