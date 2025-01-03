import { getCategoryId } from "./actions/categories";

export const getPathnameProduct = async (product) => {
  const categoryOfProduct = await getCategoryId(product.category);
  const parentCategory = await categoryOfProduct.getParentName();
  const urlPathname = `/${deleteSpaces(parentCategory)}/${deleteSpaces(
    categoryOfProduct.name
  )}/${deleteSpaces(product.name)}?id=${product._id}`;
  return urlPathname;
};

const deleteSpaces = (string) => {
  return string.split(" ").join("-");
};
