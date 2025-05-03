import { getPathnameProduct } from "@/lib/func";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductOffer({ product }) {
  return (
    <Link
      href={`${await getPathnameProduct(product)}`}
      className="bg-gray-900/80 rounded-lg px-4 py-2 flex shadow shadow-black"
    >
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="w-fit">
          <Image
            src={product.images[0]?.url ?? noImage}
            alt={product.name}
            width={100}
            height={100}
            className="rounded-md object-contain"
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
      </div>
    </Link>
  );
}
