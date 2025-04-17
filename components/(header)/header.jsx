import Image from "next/image";
import Link from "next/link";
import Cart from "../(cart)/cart";
import MegaMenu from "./navMenu/megaMenu";
import AdminSearch from "../adminSearch";
import MenuMobile from "./navMenu/menuMobile";

export default function Navbar() {
  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 w-full shadow-sm shadow-gray-950">
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
        <div className="flex-1 mx-4 hidden md:block">
          <AdminSearch className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        {/* Carrito y menú */}
        <div className="flex items-center gap-6">
          {/* Navegación principal (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/home"
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/outlet"
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Outlet
            </Link>
            <MegaMenu />
          </nav>
          <button className="relative p-1 rounded-md hover:bg-gray-800 transition-colors hidden md:flex">
            <Cart />
          </button>

          {/* Navegación principal (Mobile) */}
          <MenuMobile />
        </div>
      </div>
    </header>
  );
}
