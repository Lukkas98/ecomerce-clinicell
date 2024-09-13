"use server";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { CategoryModel } from "@/models/category";
import { revalidatePath } from "next/cache";
import { AdminStorage } from "../firebaseConfig/firebaseAdmin";
import checkAdmin from "../firebaseConfig/checkAdmin";
import { updateFirebaseURLs } from "../actions";

const Url = process.env.URL_FRONT;

export const getProducts = async (page = 1, isAdmin = false, filter = "") => {
  try {
    await connectDB();
    const limit = 9;

    const products = await ProductModel.find()
      .byFilters("", filter, page, limit, isAdmin)
      .exec();

    if (!products) throw new Error("No hay productos");
    return products;
  } catch (error) {
    return error.message;
  }
};

export const getTotalPages = async (search, categoryId) => {
  const limit = 9;
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (categoryId) {
    query.category = categoryId;
  }
  const totalDocuments = await ProductModel.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / limit);
  return totalPages;
};

export const searchProducts = async (
  search,
  isAdmin = false,
  page = 1,
  filter = ""
) => {
  await connectDB();
  const limit = 9;

  const products = await ProductModel.find()
    .byFilters(search, filter, page, limit, isAdmin)
    .exec();

  return products;
};

export const getProduct = async (id) => {
  try {
    await connectDB();
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("El producto no existe");
    }

    return product;
  } catch (error) {
    return error.message;
  }
};

export async function createProduct(formData, urls) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");

    await connectDB();
    const { name, price, stock, description, category } = formData;

    //si la categoria no existe la creo
    let categoryObj = await CategoryModel.findOne({ name: category });

    if (!categoryObj) {
      categoryObj = await CategoryModel.create({
        name: category,
        products: [],
      });
    }
    //--------
    const newProduct = await ProductModel.create({
      name,
      description,
      price,
      category: categoryObj._id,
      stock,
      images: urls,
    });
    await categoryObj.products.push(newProduct._id);
    await categoryObj.save();
    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return { message: `Producto ${name} fue creado`, success: true };
  } catch (err) {
    return { message: `${err.message}`, success: false };
  }
}

export async function changeStock(id, currentStock = true) {
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");
    await connectDB();

    const newStockValue = !currentStock;
    await ProductModel.findByIdAndUpdate(id, { stock: newStockValue });

    revalidatePath(`${Url}/admin/panel`);
    return { message: "Stock actualizado exitosamente", success: true };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function editProduct(dataProduct, Urls) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");

    await connectDB();
    const { _id, name, price, description, category, stock } = dataProduct;

    const product = await ProductModel.findByIdAndUpdate(
      _id,
      { price, description, stock },
      { new: true }
    );

    if (!product) throw new Error(`El producto id ${_id} no existe`);

    const categoryProduct = await CategoryModel.findById(product.category);
    const categoryBody = await CategoryModel.findOne({ name: category });

    if (categoryBody.name !== categoryProduct.name) {
      await categoryProduct.products.pull(product._id);
      await categoryProduct.save();

      await categoryBody.products.push(product._id);
      await categoryBody.save();

      product.category = categoryBody._id;
      await product.save();
    }

    // Si el nombre del producto cambia, mover imágenes a la nueva carpeta
    if (product.name !== name || categoryBody.name !== categoryProduct.name) {
      const bucket = AdminStorage.bucket();
      const oldFolderPath = `productos/${categoryProduct.name}/${product.name}/`;
      const newFolderPath = `productos/${categoryBody.name}/${name}/`;

      const [files] = await bucket.getFiles({
        prefix: oldFolderPath,
      });

      const MoveFiles = files.map(async (file, i) => {
        await file.move(`${newFolderPath}${name}-${i}`);
      });
      await Promise.all(MoveFiles);
      const updateImages = await updateFirebaseURLs(
        Urls,
        categoryBody.name,
        name
      );
      product.images = updateImages;
    } else {
      product.images = Urls;
    }
    // Actualizar el producto
    product.name = name;
    product.price = price;
    product.description = description;
    product.stock = stock;
    await product.save();

    revalidatePath(`${Url}/admin/panel`);
    return {
      message: `El producto ${product.name} se editó perfectamente`,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function deleteProduct(productId) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");

    const product = await ProductModel.findByIdAndDelete(productId);

    if (!product) throw new Error(`El producto a borrar no existe`);

    const category = await CategoryModel.findById(product.category);
    await category.products.pull(productId);
    await category.save();

    await deleteFolder(`productos/${category.name}/${product.name}/`);

    revalidatePath(`${Url}/admin/panel`);
    return {
      success: true,
      message: `Producto ${product.name} borrado`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: `${error.message}` };
  }
}

export const deleteFolder = async (folderPath) => {
  const bucket = AdminStorage.bucket();
  const [files] = await bucket.getFiles({ prefix: folderPath });

  const deletePromises = files.map((file) => file.delete());

  await Promise.all(deletePromises);
  console.log(`Todos los archivos en ${folderPath} fueron borrados.`);
};

const getPathFromUrl = (url) => {
  const decodedUrl = decodeURIComponent(url);
  const pathStartIndex = decodedUrl.indexOf("/o/") + 3;
  const pathEndIndex = decodedUrl.indexOf("?alt=");
  return decodedUrl.substring(pathStartIndex, pathEndIndex);
};

export const deleteImageByUrl = async (url, nameProduct) => {
  try {
    const product = await ProductModel.findOne({ name: nameProduct });
    product.images.pull(url);
    product.save();

    const path = getPathFromUrl(url);
    const bucket = AdminStorage.bucket();
    await bucket.file(path).delete();
    console.log(`Imagen en ${path} borrada exitosamente.`);
    revalidatePath(`${Url}/admin/panel`);
    return { message: `Imagen borrada exitosamente.`, success: true };
  } catch (err) {
    // console.error("Error al borrar la imagen:", err.message);
    return {
      message: `Error al borrar la imagen:  ${err.message}`,
      success: false,
    };
  }
};
