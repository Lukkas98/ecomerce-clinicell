import Image from "next/image";
import Link from "next/link";
import ActionButton from "../app/(principal)/[parentCategory]/[category]/[name]/components/actionButton";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { getPathnameProduct } from "@/lib/func";

const noImage =
  "https://fakeimg.pl/300x300/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, description, outlet, discount } = product;

  return (
    <div
      className={`bg-gray-800 relative p-4 rounded-md shadow-lg 
        flex gap-1 flex-col justify-between transition-all
      ${
        stock
          ? "outline-1 outline-green-500 hover:bg-gray-900 hover:outline hover:outline-green-700"
          : "outline-1 outline-red-500 cursor-not-allowed opacity-50"
      }`}
    >
      <Link
        href={`${await getPathnameProduct(product)}`}
        className="w-full aspect-square relative"
      >
        <Image
          src={images[0]?.url || noImage}
          fill={true}
          alt="imgProduct"
          sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 500px"
          quality={80}
          priority={true}
          className="object-contain mb-4 rounded-md outline-1 outline-gray-400 bg-gray-900"
        />
      </Link>
      <Link
        href={`${await getPathnameProduct(product)}`}
        className={`text-base font-semibold mb-2 line-clamp-2 ${
          outlet ? "text-orange-400" : "text-gray-200"
        }`}
        title={name}
      >
        {name}
      </Link>

      <p className="text-sm line-clamp-2 text-gray-400 mb-2">{description}</p>
      {outlet ? (
        <div>
          <p className={`text-sm text-orange-400 mt-1`}>Liquidación</p>
          <p className="text-sm line-through text-gray-400">$ {price}</p>
          <p className="text-lg font-bold text-green-500 flex items-center gap-2">
            $ {Math.ceil(price - price * 0.3)}
            <CheckBadgeIcon width={20} height={20} color="green" />
          </p>
        </div>
      ) : discount ? (
        <div>
          <p className={`text-sm text-blue-400 mt-1`}>Oferta</p>
          <p className="text-sm line-through text-gray-400">$ {price}</p>
          <p className="text-lg font-bold text-blue-500 flex items-center gap-2">
            $ {discount}
            <CheckBadgeIcon width={20} height={20} color="green" />
          </p>
        </div>
      ) : (
        <p className="font-bold text-lg text-gray-100 mb-4">$ {price}</p>
      )}
      {!stock ?? <p className="text-center text-red-600">Sin Stock</p>}
      <div className="flex flex-col gap-1">
        <ActionButton
          product={JSON.parse(JSON.stringify(product))}
          stock={stock}
          typeButton="ADD_PRODUCT"
        />
      </div>
    </div>
  );
}
