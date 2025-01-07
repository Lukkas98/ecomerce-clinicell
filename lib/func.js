import { getCategoryId } from "./actions/categories";

export const getPathnameProduct = async (product) => {
  const categoryOfProduct = await getCategoryId(product.category);
  const parentCategory = await categoryOfProduct.getParentName();
  const [nameParentCategory, nameCategory, nameProduct, id] = [
    deleteSpaces(parentCategory),
    deleteSpaces(categoryOfProduct.name),
    deleteSpaces(product.name),
    product._id,
  ];

  const urlPathname = `/${nameParentCategory}/${nameCategory}/${nameProduct}?id=${id}`;
  return urlPathname;
};

const deleteSpaces = (string) => {
  return string.split(" ").join("-");
};
