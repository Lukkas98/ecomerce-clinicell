import Image from "next/image";
import ButtonsProd from "./buttons";
import CheckboxStock from "./checkboxStock";
import { getCategoryId } from "@/lib/actions/categories";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

const categoryProd = async (id) => {
  const category = await getCategoryId(id);
  return JSON.parse(JSON.stringify(category.name));
};

export default function ProductsTab({ data }) {
  return (
    <main className="flex-1 p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((item, i) => (
        <div
          key={i}
          className="border border-gray-300 h-fit p-4 rounded-lg bg-teal-50 flex justify-between items-center shadow-black shadow-md"
        >
          <div className="w-[80%]">
            <h2
              title={item.name}
              className="text-lg font-semibold mb-2 md:line-clamp-1"
            >
              {item.name}
            </h2>
            <div className="grid grid-cols-2 gap-2 overflow-hidden">
              <div
                className={`aspect-square relative w-24 overflow-hidden rounded-md ${
                  item.images[0] ? "shadow-black shadow" : ""
                }`}
              >
                <Image
                  src={item.images[0] || noImage}
                  alt={item.name + "image"}
                  fill={true}
                  sizes="96px"
                  quality={80}
                />
              </div>
              {/* cambiar si pongo categories como [] */}
              <p className="text-xs whitespace-nowrap mt-2">
                {categoryProd(item.category)}
              </p>
            </div>
            <div className="flex w-full justify-between pt-4">
              <p className="text-gray-600">$ {item.price}</p>
              <div className="flex gap-3 items-center">
                <CheckboxStock item={JSON.parse(JSON.stringify(item))} />
              </div>
            </div>
          </div>
          <ButtonsProd itemId={item._id.toString()} />
        </div>
      ))}
    </main>
  );
}
