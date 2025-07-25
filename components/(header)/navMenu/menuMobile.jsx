"use client";
import MegaMenuMobile from "./megaMenuMobile";
import { FaBars } from "react-icons/fa";
import Cart from "@/components/cart";
import { useMenu } from "@/components/providers/menuContext";

export default function MenuMobile({ dataCategories = [], children, boleans }) {
  const { toggleMenu } = useMenu();

  return (
    <nav className="lg:hidden flex items-center">
      <button className="flex items-center gap-3 justify-center relative p-1 rounded-md hover:bg-gray-800 transition-colors">
        <FaBars className="w-5 h-5" onClick={toggleMenu} />
        <Cart />
      </button>

      <MegaMenuMobile dataCategories={dataCategories} boleans={boleans}>
        {children}
      </MegaMenuMobile>
    </nav>
  );
}
