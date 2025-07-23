import Image from "next/image";
import Link from "next/link";
import ActionButton from "../app/(principal)/[parentCategory]/[category]/[name]/components/actionButton";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { getPathnameProduct } from "@/lib/func";

const noImage = "https://dummyimage.com/200x200?text=Sin+Imagen";
// "https://fakeimg.pl/300x300/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, description, outlet, discount, units } =
    product;

  return (
    <div
      className={`bg-gray-800 relative p-2 rounded-md shadow-lg 
        grid-cols-2 grid gap-1 justify-between transition-all
      ${
        stock
          ? "outline-1 outline-green-700/50 hover:bg-gray-900 hover:outline hover:outline-green-700"
          : "outline-1 outline-red-700/50 opacity-50"
      }`}
    >
      <Link
        href={`${await getPathnameProduct(product)}`}
        className="h-[130px] aspect-square relative inline-block"
      >
        <Image
          src={images[0]?.url || noImage}
          fill={true}
          alt="imgProduct"
          sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 500px"
          quality={80}
          priority={true}
          className="object-contain rounded-md outline-1 outline-gray-600 bg-gray-900"
        />
      </Link>

      <Link
        className="inline-block"
        href={`${await getPathnameProduct(product)}`}
      >
        <p
          className={`text-base font-semibold mb-2 line-clamp-2 ${
            outlet ? "text-orange-400" : "text-gray-200"
          }`}
          title={name}
        >
          {name}
        </p>

        <p className="text-xs line-clamp-2 text-gray-400 mb-2">{description}</p>
        {outlet ? (
          <div>
            <p className={`text-sm text-orange-400 mt-1`}>Liquidación</p>
            <p className="text-xs line-through text-gray-400">$ {price}</p>
            <p className="text-sm font-bold text-green-500 flex items-center gap-2">
              $ {Math.ceil(price - price * 0.3)}
              <CheckBadgeIcon width={20} height={20} color="green" />
            </p>
          </div>
        ) : discount ? (
          <div>
            <p className={`text-sm text-blue-400 mt-1`}>Oferta</p>
            <p className="text-xs line-through text-gray-400">$ {price}</p>
            <p className="text-sm font-bold text-blue-400 flex items-center gap-1">
              $ {discount}
              <CheckBadgeIcon width={20} height={20} color="green" />
            </p>
          </div>
        ) : (
          <p className="font-bold text-sm text-gray-100 mb-4">$ {price}</p>
        )}
      </Link>

      <div className="grid grid-cols-[140px_minmax(80px,_1fr)_100px] w-full col-span-2 items-center">
        {stock && (
          <div className="mt-2 w-fit mx-auto bg-gray-900 px-1.5 py-1 rounded-md">
            <ActionButton
              product={JSON.parse(JSON.stringify(product))}
              typeButton="ADD_PRODUCT"
            />
          </div>
        )}
        {stock ? (
          <p className="text-xs text-green-400 mt-3">Unidades: {units}</p>
        ) : (
          <p className="text-xs text-red-500 mt-3 font-bold w-fit mx-auto">
            Sin Stock
          </p>
        )}
      </div>
    </div>
  );
}
