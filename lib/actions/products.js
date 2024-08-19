"use server";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { CategoryModel } from "@/models/category";
import { revalidatePath } from "next/cache";
import { AdminStorage } from "../firebaseConfig/firebaseAdmin";
import checkAdmin from "../firebaseConfig/checkAdmin";

const Url = process.env.URL_FRONT;

export const getProducts = async () => {
  try {
    await connectDB();
    const products = await ProductModel.find({});

    if (!products) {
      throw new Error("No hay productos");
    }

    return products;
  } catch (error) {
    return error.message;
  }
};

export const searchProducts = async (search) => {
  await connectDB();
  const products = await ProductModel.find({
    name: { $regex: `^${search}`, $options: "i" },
  });
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

export async function editProduct(dataProduct) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");

    await connectDB();
    const { _id, name, price, description, category, stock, images } =
      dataProduct;

    const product = await ProductModel.findByIdAndUpdate(
      _id,
      { price, description, stock, images },
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
      const updateImages = updateFirebaseURLs(images, categoryBody.name, name);
      product.images = updateImages;
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
      success: true,
    };
  }
};

function updateFirebaseURLs(images = [], newCategory, newFolder) {
  const newPath = `productos/${newCategory}/${newFolder}`;

  return images.map((url, index) => {
    const decodedUrl = decodeURIComponent(url);
    const indexQuery = decodedUrl.indexOf("?alt");
    const query = decodedUrl.slice(indexQuery);

    const basePathIndex = decodedUrl.indexOf("productos/");
    const basePath = decodedUrl.slice(0, basePathIndex);

    const newFileName = `${newFolder}-${index}`;
    const newPathEncoded = encodeURIComponent(`${newPath}/${newFileName}`);

    const updatedUrl = `${basePath}${newPathEncoded}${query}`;

    return updatedUrl;
  });
}
