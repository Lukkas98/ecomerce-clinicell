import Image from "next/image";
import ButtonsProd from "./buttonsProd";
import CheckboxStock from "./checkboxStock";
import CheckboxOutlet from "./checkboxOutlet";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

const categoryProd = async (product) => {
  const categories = await product.getNamesCategories();
  return categories.map((cat) => (
    <p className="line-clamp-1" key={cat._id}>
      {cat.name}
    </p>
  ));
};

export default function Product({ product }) {
  return (
    <div
      className={`relative bg-gray-800 rounded-lg p-3 shadow shadow-black
       max-w-full w-full grid grid-cols-[96px,auto,20px] items-center border
       place-items-center 
       ${product.stock ? "border-green-500 text-black" : "border-red-500"}`}
    >
      <div className="aspect-square w-24 relative shadow-sm shadow-black">
        <Image
          src={product.images[0] || noImage}
          alt={product.name + " image"}
          className="rounded-md object-contain"
          fill={true}
          quality={40}
          sizes="96px"
        />
      </div>

      <div className="flex flex-col justify-between ml-4 w-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-100 px-1.5 line-clamp-2 hover:line-clamp-none">
            {product.name}
          </h2>
          {!product.outlet ? (
            <p className="text-base font-medium text-gray-300">
              $ {product.price}
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 line-through">
                $ {product.price}
              </p>
              <p className=" text-base font-medium text-gray-300">
                $ {Math.ceil(product.price - product.price * 0.3)}
              </p>
            </div>
          )}
          <div className="text-sm text-gray-500 line-clamp-2 hover:line-clamp-none">
            {categoryProd(product)}
          </div>
        </div>
      </div>
      <ButtonsProd itemId={product._id.toString()} />
      <div className="flex gap-5 col-span-2 mt-3 place-self-center">
        <CheckboxStock item={JSON.parse(JSON.stringify(product))} />
        <CheckboxOutlet item={JSON.parse(JSON.stringify(product))} />
      </div>
    </div>
  );
}

// anterior

{
  /* <div
  className={`border-2 p-3 rounded-lg bg-gray-800 w-full mx-auto grid justify-items-center grid-cols-[110px,auto] gap-4 shadow-lg ${
    item.stock ? "border-green-500 text-black" : "border-red-500"
  }`}
>
  <div
    className={`aspect-square w-[100px] relative overflow-hidden rounded-lg ${
      item.images[0] ? "shadow-md shadow-black" : ""
    }`}
  >
    <Image
      src={item.images[0] || noImage}
      alt={item.name + " image"}
      fill={true}
      sizes="100px"
      className="object-contain"
      quality={50}
    />
  </div>
  <div className="text-sm text-gray-400 mt-2 relative">
    <p className="absolute -top-4 font-semibold border-b border-gray-400 pb-0.5">
      Categorias:
    </p>
    <div className="mt-2">{categoryProd(item)}</div>
  </div>

  <div className="w-full flex flex-col justify-between col-span-2">
    <h2 className="text-lg font-semibold text-white" title={item.name}>
      {item.name}
    </h2>

    <div className="flex justify-between items-center my-2">
      {!item.outlet ? (
        <p className="text-base font-medium text-gray-300">$ {item.price}</p>
      ) : (
        <div>
          <p className="text-sm text-gray-500 line-through">$ {item.price}</p>
          <p className=" text-base font-medium text-gray-300">
            $ {Math.ceil(item.price - item.price * 0.3)}
          </p>
        </div>
      )}

      <CheckboxStock item={JSON.parse(JSON.stringify(item))} />
      <CheckboxOutlet item={JSON.parse(JSON.stringify(item))} />
    </div>
  </div>
  <ButtonsProd itemId={item._id.toString()} />
</div>; */
}
