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
      className="flex rounded-lg bg-gray-900/80 px-4 py-2 shadow shadow-black"
    >
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="relative h-25 w-25 lg:h-37.5 lg:w-37.5">
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
          <h3 className="line-clamp-2 text-sm font-semibold text-blue-400">
            {product.name}
          </h3>
          <div className="grid place-content-start">
            <p className="text-xs text-gray-400 line-through">
              ${product.price}
            </p>
            <p className="flex items-center gap-1 text-base font-semibold text-blue-500">
              ${product.discount}
              <CheckBadgeIcon width={20} height={20} color="blue" />
            </p>
          </div>
        </div>
        <p className="mx-auto w-fit text-xs whitespace-nowrap text-gray-300">
          Disponibles: {product.units}
        </p>
      </div>
    </Link>
  );
}
