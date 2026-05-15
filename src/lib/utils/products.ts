export function getCalculatedPrice(product: {
  price: number;
  offert: number;
  outlet: { isActive: boolean; price: number };
}) {
  if (product.outlet.isActive) return product.outlet.price;
  return product.offert > 0 ? product.offert : product.price;
}
