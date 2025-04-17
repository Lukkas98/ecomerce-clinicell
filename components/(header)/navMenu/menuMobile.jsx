"use client";
import MegaMenuMobile from "./megaMenuMobile";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Cart from "@/components/(cart)/cart";

export default function MenuMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="md:hidden flex items-center">
      <button className=" flex items-center gap-3 justify-center relative p-1 rounded-md hover:bg-gray-800 transition-colors">
        <FaBars className="w-5 h-5" onClick={toggleMenu} />
        <Cart />
      </button>

      <MegaMenuMobile menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </nav>
  );
}
