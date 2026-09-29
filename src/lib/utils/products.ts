import type { ProductDTO } from "@/lib/types/products";

export function getProductDisplayPrice(
  product: Pick<ProductDTO, "price" | "discount">,
) {
  const hasDiscount = product.discount.offert || product.discount.outlet;
  if (!hasDiscount) return product.price;
  return product.discount.DiscountPrice;
}
