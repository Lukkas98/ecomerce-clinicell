"use client";
import { useState } from "react";
import Image from "next/image";
import InputSearch from "../inputSearch";
import Cart from "../(cart)/cart";
import MegaMenu from "./navMenu/megaMenu";
import MegaMenuMobile from "./navMenu/megaMenuMobile";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 w-full shadow-sm shadow-gray-950">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e información */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo Clinic-Cell"
            width={50}
            height={50}
            className="rounded-lg"
          />

          <div>
            <h1 className="text-lg font-bold">Clinic-Cell</h1>
            <p className="text-xs lg:text-sm text-gray-400">
              Repuestos y Accesorios
            </p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex-1 mx-4 hidden md:block">
          <InputSearch className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Carrito y menú */}
        <div className="flex items-center gap-6">
          {/* Menú hamburguesa para mobile */}
          <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Botones del menú para tablet y desktop */}
          <nav className="hidden sm:flex gap-4">
            <Link href={"/home"} className="text-sm hover:text-blue-500">
              Home
            </Link>
            <Link href={"/outlet"} className="text-sm hover:text-blue-500">
              Outlet
            </Link>
            {/* <button className="text-sm hover:text-blue-500">Ofertas</button> */}
            <MegaMenu />
          </nav>

          {/* Carrito */}
          <button className="relative">
            <Cart />
          </button>
        </div>
      </div>

      <MegaMenuMobile menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Barra de búsqueda para mobile */}
      <div className="block md:hidden px-4 py-2">
        <InputSearch className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </header>
  );
}
