import { getCategories } from "@/lib/actions";
import Image from "next/image";
import LinkHeader from "./linkHeader";

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="grid items-center grid-cols-[85%,auto] w-full h-[20vh] lg:h-[14vh] bg-teal-50 shadow-black shadow-md z-50">
      <div className="flex items-center gap-4 mx-5 my-3">
        <div className="relative h-16 w-16 lg:h-20 lg:w-20 aspect-square rounded-full overflow-hidden">
          <Image
            src={"/LogoPrueba.png"}
            alt="Logo clinic cell"
            fill={true}
            sizes="20vw"
            quality={100}
          />
        </div>
        <div>
          <h1 className="font-bold text-xl">Clinic Cell</h1>
          <span>Sobre nosotros</span>
        </div>
      </div>
      {/* componenente carrito (cliente) */}
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 lg:w-8 lg:h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>
      {/* <div className="mx-3 my-2">
        componente buscar
        <h4>Lupa</h4>
      </div> */}
      <nav className="flex col-span-2 gap-3 px-3 py-4 overflow-hidden overflow-x-auto bg-blue-900 text-teal-50 h-full items-center lg:hidden">
        {/* categorias cargadas del backend */}
        <LinkHeader categoryName={"todos"} className={"border px-2 py-1 border-blue-800 rounded-md hover:bg-blue-950 transition-all"} />
        {categories?.map((category) => (
          <LinkHeader categoryName={category.name} className={"border px-2 py-1 border-blue-800 rounded-md hover:bg-blue-950 transition-all"}  key={category._id} />
        ))}
      </nav>
    </header>
  );
}