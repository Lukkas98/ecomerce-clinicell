import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import ActionButton from "./components/actionButton";
import Carousel from "./components/carousel";
import BtnBack from "./components/btnBack";
import { getProduct } from "@/lib/actions/products";

export default async function ProductPage({ searchParams }) {
  const { id } = await searchParams;
  const product = await getProduct(id);

  if (product === "El producto no existe") {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-red-600">
          Producto no encontrado
        </h1>
        <p className="text-gray-500">
          Lo sentimos, el producto que estás buscando no existe o ha sido
          eliminado.
        </p>
      </div>
    );
  }

  const { name, description, price, stock, images, category, outlet, units } =
    product;

  return (
    <div className="min-h-[100svh]">
      <div className="container mx-auto px-4 py-12">
        <BtnBack />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4 h-80 md:h-96 mb-6 md:mb-0 rounded-lg">
            <div className="aspect-square h-full rounded-lg relative max-w-[500px] mx-auto shadow-lg">
              <Carousel images={JSON.parse(JSON.stringify(images))} />
            </div>
          </div>

          <div className="flex flex-col justify-between w-full md:w-1/2">
            <h1 className="text-3xl font-semibold mb-4">{name}</h1>
            <p className="text-sm text-gray-400 mb-6">{description}</p>

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
                  <p className="text-3xl font-semibold text-green-500 flex items-center gap-2">
                    $ {Math.ceil(price - price * 0.3)}
                    <CheckBadgeIcon width={24} height={24} color="green" />
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-indigo-600">$ {price}</p>
              )}
            </div>

            <div className="mt-8 relative">
              {stock ? (
                <>
                  <p className="text-sm text-green-500">Unidades: {units}</p>
                  <ActionButton
                    product={JSON.parse(JSON.stringify(product))}
                    stock={stock}
                    typeButton={"ADD_PRODUCT"}
                    className={
                      "mt-4 bg-gray-800 w-fit px-2 py-1 rounded-md text-xl"
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
