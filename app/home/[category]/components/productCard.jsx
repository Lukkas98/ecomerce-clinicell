import { getCategoryId } from "@/lib/actions/categories";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../[name]/components/actionButton";

const noImage =
  "https://fakeimg.pl/300x300/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, _id, category } = product;

  const { search } = searchParams;

  const categoryOfProduct = await getCategoryId(category);
  const urlPathname = `/home/${categoryOfProduct.name}/${name}`;

  return (
    <div
      className={`${
        !stock ? "opacity-60 text-gray-500 outline-gray-500" : "outline-black"
      } z-0 w-[90%] grid grid-cols-2 h-fit p-2 mx-auto rounded-xl outline outline-1 hover:bg-blue-100 transition-all shadow-[black] shadow-md `}
    >
      <Link
        href={`${urlPathname}?id=${_id}`}
        className="relative transition-all duration-500 aspect-square w-full max-w-[200px] mx-auto"
      >
        <Image
          src={images[0] || noImage}
          fill={true}
          alt="imgProduct"
          sizes="(max-width: 768px) 80px, (max-width: 1200px) 160px, 33vw"
          quality={100}
          priority={true}
          className="outline outline-1 outline-gray-300 rounded-lg"
        />
      </Link>
      <div className="self-center flex flex-col justify-between h-[100%] ml-3 cursor-default">
        <Link
          href={`${urlPathname}?id=${_id}`}
          title={name}
          className="font-semibold text-lg line-clamp-2"
        >
          {name}
        </Link>
        <span className="font-bold text-xl">{"$ " + price}</span>
        <div className="flex flex-col gap-1">
          <span className="text-sm ">{stock ? "En stock" : "Sin stock"}</span>
          <ActionButton
            product={JSON.parse(JSON.stringify(product))}
            stock={stock}
            typeButton="ADD_PRODUCT"
          />
        </div>
      </div>
    </div>
  );
}
