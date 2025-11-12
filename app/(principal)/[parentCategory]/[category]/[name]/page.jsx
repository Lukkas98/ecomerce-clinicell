import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import ActionButton from "./components/actionButton";
import Carousel from "./components/carousel";
import BtnBack from "./components/btnBack";
import { getProduct } from "@/lib/actions/products";
import { notFound } from "next/navigation";

export default async function ProductPage({ searchParams }) {
  const { id } = await searchParams;
  const product = await getProduct(id);

  if (product === "El producto no existe") return notFound();

  const { name, description, price, stock, images, category, outlet, units } =
    product;

  return (
    <div className="min-h-[100svh]">
      <div className="container mx-auto px-4 py-12">
        <BtnBack />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="mb-6 h-80 w-full rounded-lg md:mb-0 md:h-96 md:w-3/4">
            <div className="relative mx-auto aspect-square h-full max-w-[500px] rounded-lg shadow-lg">
              <Carousel images={JSON.parse(JSON.stringify(images))} />
            </div>
          </div>

          <div className="flex w-full flex-col justify-between md:w-1/2">
            <h1 className="mb-4 text-3xl font-semibold">{name}</h1>
            <p className="mb-6 text-sm text-gray-400">{description}</p>

            <div className="mb-6">
              {outlet ? (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-400 line-through">
                      $ {price}
                    </p>
                    <p className="text-sm font-medium text-orange-400">
                      Outlet
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-3xl font-semibold text-green-500">
                    $ {Math.ceil(price - price * 0.3)}
                    <CheckBadgeIcon width={24} height={24} color="green" />
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-indigo-600">$ {price}</p>
              )}
            </div>

            <div className="relative mt-8">
              {stock ? (
                <>
                  <p className="text-sm text-green-500">Unidades: {units}</p>
                  <ActionButton
                    product={JSON.parse(JSON.stringify(product))}
                    stock={stock}
                    typeButton={"ADD_PRODUCT"}
                    className={
                      "mt-4 w-fit rounded-md bg-gray-800 px-2 py-1 text-xl"
                    }
                  />
                </>
              ) : (
                <p className="text-sm text-red-500">Sin Stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
