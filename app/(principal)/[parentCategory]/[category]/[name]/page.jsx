import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import ActionButton from "./components/actionButton";
import Carousel from "./components/carousel";
import BtnBack from "./components/btnBack";
import { getProduct } from "@/lib/actions/products";

//http://localhost:3000/Audio-y-Parlantes/Aro-Led/Luz-Emergencia?id=68190a3f6045433e860337b3

export default async function ProductPage({ searchParams }) {
  const { id } = await searchParams;
  const product = await getProduct(id);
  console.log("product: ", product);

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

  const { name, description, price, stock, images, category, outlet } = product;

  // return <p>{id}</p>;
  return (
    <div className="min-h-[100svh]">
      <div className="container mx-auto px-4 py-12">
        <BtnBack />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/4 h-80 md:h-96 mb-6 md:mb-0 rounded-lg">
            <div className="aspect-square h-full rounded-lg relative max-w-[500px] mx-auto shadow-lg">
              <Carousel images={images} />
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
              <p
                className={`mb-6 text-sm font-medium absolute -top-6 ${
                  stock ? "text-green-500" : "text-red-500"
                }`}
              ></p>
              <ActionButton
                product={JSON.parse(JSON.stringify(product))}
                stock={stock}
                typeButton={"ADD_PRODUCT"}
                className={
                  "w-full bg-indigo-600 text-white px-5 py-3 hover:bg-indigo-700 hover:outline outline-1 outline-gray-200 rounded-md"
                }
                ss
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
