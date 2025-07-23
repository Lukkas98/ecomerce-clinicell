import { getPathnameProduct } from "@/lib/func";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

const noImage = "https://dummyimage.com/200x200?text=Sin+Imagen";
// "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductOffer({ product }) {
  return (
    <Link
      href={`${await getPathnameProduct(product)}`}
      className="bg-gray-900/80 rounded-lg px-4 py-2 flex shadow shadow-black"
    >
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="w-[100px] h-[100px] lg:w-[150px] lg:h-[150px] relative">
          <Image
            src={product.images[0]?.url ?? noImage}
            alt={product.name}
            fill
            sizes="120px"
            className="rounded-md"
            quality={90}
          />
        </div>
        <div className="flex flex-col justify-between">
          <h3 className=" text-sm text-blue-400 font-semibold line-clamp-2">
            {product.name}
          </h3>
          <div className="grid place-content-start">
            <p className="text-xs text-gray-400 line-through">
              ${product.price}
            </p>
            <p className="text-base font-semibold text-blue-500 flex items-center gap-1">
              ${product.discount}
              <CheckBadgeIcon width={20} height={20} color="blue" />
            </p>
          </div>
        </div>
        <p className=" whitespace-nowrap mx-auto w-fit text-xs text-gray-300">
          Disponibles: {product.units}
        </p>
      </div>
    </Link>
  );
}
