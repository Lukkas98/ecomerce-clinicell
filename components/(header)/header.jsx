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
    <header className="bg-gradient-to-r from-gray-800 from-55% to-blue-900 text-white fixed top-0 z-50 w-full shadow-sm shadow-gray-950">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Image
              src="/logo.png"
              alt="Logo Clinic-Cell"
              width={50}
              height={50}
              className="rounded-lg hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          <div>
            <h1 className="text-lg font-bold">Clinic-Cell</h1>
            <p className="text-xs lg:text-sm text-gray-400">
              Repuestos y Accesorios
            </p>
          </div>
        </div>

        {/* Barra de búsqueda (desktop) */}
        <div className="flex-1 mx-4 hidden lg:block">
          <ClientSearch />
        </div>

        {/* Carrito y menú */}
        <div className="flex items-center gap-6">
          {/* Navegación principal (desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/home"
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            {hasOutlet && (
              <Link
                href="/outlet"
                className="text-sm hover:text-blue-400 transition-colors"
              >
                Outlet
              </Link>
            )}
            {hasOffers && (
              <Link
                href="/ofertas"
                className="text-sm hover:text-blue-400 transition-colors"
              >
                Ofertas de la semana
              </Link>
            )}

            <MegaMenu dataCategories={JSON.parse(JSON.stringify(categories))} />
          </nav>
          <button className="relative p-1 rounded-md hover:bg-gray-800 transition-colors hidden lg:flex">
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
