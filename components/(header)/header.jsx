import { getCategories } from "@/lib/actions";
import Image from "next/image";
import LinkHeader from "./linkHeader";
import Cart from "./(cart)/cart";

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="grid items-center grid-cols-[1fr,0.2fr] w-full h-fit bg-teal-50 shadow-black shadow-md z-50">
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
      <Cart />

      {/* <div className="flex justify-center w-full my-1">
        <input type="text" placeholder="Buscador" />
      </div> */}
      <nav className="flex col-span-3 gap-3 px-3 py-1 overflow-hidden overflow-x-auto snap-x bg-blue-900 text-teal-50 h-full items-center lg:hidden">
        {/* categorias cargadas del backend */}
        <LinkHeader
          categoryName={"Todos"}
          className={
            "border px-3 py-2 border-blue-800 rounded-md hover:bg-blue-950 transition-all"
          }
        />
        {categories?.map((category) => (
          <LinkHeader
            key={category._id}
            categoryName={category.name}
            className={
              "border px-3 py-2 border-blue-800 rounded-md hover:bg-blue-950 transition-all"
            }
          />
        ))}
      </nav>
    </header>
  );
}
