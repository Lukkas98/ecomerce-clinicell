import { getCategoryId } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

export default async function Product({ product, searchParams }) {
  const { images, name, price, description, stock, _id, category } = product;

  const { search } = searchParams;

  const categoryOfProduct = await getCategoryId(category);
  const urlPathname = `/home/${categoryOfProduct.name}/${_id}`;

  return (
    <Link
      href={`${urlPathname}`}
      className="w-[90%] grid grid-cols-2 h-40 mx-auto rounded-xl outline outline-1 outline-blue-800 shadow-[black] shadow-md overflow-hidden"
    >
      <div className="relative hover:scale-105 transition-all duration-500">
        <Image
          src={images[0]}
          fill={true}
          alt="imgProduct"
          sizes="50vw"
          quality={100}
        />
      </div>
      <div className="self-center flex flex-col justify-between h-[90%] ml-3">
        <h6 className="font-bold text-lg">{name}</h6>
        <span className="font-semibold text-lg">{"$ " + price}</span>
        <span className="text-sm">{stock ? "En stock" : "Sin stock"}</span>
      </div>
    </Link>
  );
}
