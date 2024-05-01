import Carousel from "./components/carousel";
import { getProduct } from "@/lib/actions";

export default async function ProductPage({ params }) {
  const { id } = params;

  const product = await getProduct(id)

  return (
    <section className="mt-5 grid gap-y-2 place-items-center">
      <h6 className=" font-bold text-2xl">{product.name}</h6>
      <div className="aspect-square w-[80%] bg-slate-600 rounded-lg relative overflow-hidden" >
        <Carousel images={product.images}/>
      </div>
      <span className="font-semibold" >Precio: $ {product.price}</span>
      <p>Descripción: {product.description}</p>
      <span>{product.stock ? "Stock disponible" : "Fuera de stock" }</span>
    </section>
  );
}
