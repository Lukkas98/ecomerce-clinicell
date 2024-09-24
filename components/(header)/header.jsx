import { getCategories } from "@/lib/actions/categories";
import Image from "next/image";
import LinkHeader from "./linkHeader";
import Cart from "../(cart)/cart";
import InputSearch from "../inputSearch";

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className=" bg-gray-800 sticky top-0 text-white shadow-md z-50">
      <div className="container mx-auto px-3 py-2 flex flex-col sm:flex-row sm:justify-between items-center">
        {/* Logo y nombre */}
        <div className="flex gap-4 items-center mb-2 sm:mb-0">
          <div className="w-16 h-16 relative bg-blue-700 flex items-center justify-center text-2xl font-bold text-white rounded-md overflow-hidden">
            <Image
              src={"/logo.png"}
              alt="Logo clinic cell"
              fill={true}
              sizes="80px"
              quality={100}
            />
          </div>
          <div>
            <h1 className="ml-3 text-2xl font-bold">Clinic-Cell</h1>
            <span className="text-sm text-gray-400 font-semibold">
              Repuestos y Accesorios
            </span>
          </div>
        </div>

        {/* Barra de búsqueda y carro */}
        <div className="grid grid-cols-[1.8fr,0.3fr] gap-4 mx-3">
          <InputSearch />
          <Cart />
        </div>
      </div>
      {/* Categorías */}
      <nav className="bg-gray-800 py-2 mb-5 lg:hidden">
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-2">
          <LinkHeader
            categoryName={"Todos"}
            className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 whitespace-nowrap"
          />
          {categories?.map((category) => (
            <LinkHeader
              key={category._id}
              categoryName={category.name}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 whitespace-nowrap"
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
