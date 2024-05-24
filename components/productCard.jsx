import { getCategoryId } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, _id, category } = product;

  const { search } = searchParams;

  const categoryOfProduct = await getCategoryId(category);
  const urlPathname = `/home/${categoryOfProduct.name}/${_id}`;

  return (
    <div className="z-0 w-[90%] grid grid-cols-2 h-40 mx-auto rounded-xl outline outline-1 outline-black hover:bg-blue-100 transition-all shadow-[black] shadow-md overflow-hidden">
      <Link
        href={`${urlPathname}`}
        className="relative transition-all duration-500"
      >
        <Image
          src={images[0]}
          fill={true}
          alt="imgProduct"
          sizes="50vw"
          quality={100}
        />
      </Link>
      <div className="self-center flex flex-col justify-between h-[90%] ml-3 cursor-default">
        <h6 className="font-semibold text-lg">{name}</h6>
        <span className="font-bold text-2xl">{"$ " + price}</span>
        <span className="text-sm">{stock ? "En stock" : "Sin stock"}</span>
        <button
          disabled={!stock}
          className="z-20 bg-blue-600 hover:bg-blue-800 disabled:bg-gray-400 disabled:text-black disabled:opacity-80 disabled:cursor-not-allowed transition-all text-white text-lg px-2 mr-3 py-1 rounded-md shadow-black shadow"
        >
          {stock ? "Añadir al carro" : "Sin stock"}
        </button>
      </div>
    </div>
  );
}
