import { getPathnameProduct } from "@/lib/func";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const discount = 0.3;
const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductOutlet({ product }) {
  const priceWithDiscount = product.price - product.price * discount;

  const formattedPrice = Number.isInteger(priceWithDiscount)
    ? priceWithDiscount
    : priceWithDiscount.toFixed(2);

  return (
    <Link
      href={`${await getPathnameProduct(product)}`}
      className="bg-gray-800 rounded-lg p-2 min-w-[120px] flex flex-col justify-between items-center gap-2"
    >
      <div>
        <div className="aspect-square w-20 relative mx-auto">
          <Image
            src={product.images[0]?.url ?? noImage}
            alt={product.name}
            fill={true}
            sizes="80px"
            className="rounded-md mb-2 object-contain"
            quality={80}
          />
        </div>
        <h3 className=" text-base text-orange-300 font-semibold line-clamp-2">
          {product.name}
        </h3>
      </div>
      <div className="grid place-content-start">
        <p className="text-sm text-gray-400 line-through">${product.price}</p>
        <p className="text-lg font-bold text-green-500 flex items-center gap-1">
          ${formattedPrice}
          <CheckBadgeIcon width={20} height={20} color="green" />
        </p>
      </div>
    </Link>
  );
}
