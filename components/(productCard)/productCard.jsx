import { getCategoryId } from "@/lib/actions/categories";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "./actionButton";
import defaultImage from "@/public/default.svg";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, _id, category } = product;

  const { search } = searchParams;

  const categoryOfProduct = await getCategoryId(category);
  const urlPathname = `/home/${categoryOfProduct.name}/${name}`;

  return (
    <div
      className={`${
        !stock ? "opacity-60 text-gray-500 outline-gray-500" : "outline-black"
      } z-0 w-[90%] grid grid-cols-2 h-40 mx-auto rounded-xl outline outline-1 hover:bg-blue-100 transition-all shadow-[black] shadow-md overflow-hidden`}
    >
      <Link
        href={`${urlPathname}`}
        className="relative transition-all duration-500"
      >
        <Image
          src={images[0] || defaultImage}
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
        <ActionButton
          product={JSON.parse(JSON.stringify(product))}
          stock={stock}
          typeButton="ADD_PRODUCT"
        />
      </div>
    </div>
  );
}
