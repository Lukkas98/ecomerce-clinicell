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
    // console.log("formData: ", formData);
    revalidatePath(`${Url}/admin/panel`);
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
      { name, price, description, stock, images },
      { new: true }
    );

    if (!product) throw new Error(`El producto id ${_id} no existe`);

    const categoryProduct = await CategoryModel.findById(product.category);
    const categoryBody =
      typeof category === "string"
        ? await CategoryModel.findOne({ name: category })
        : category;

    if (
      typeof category !== "object" &&
      categoryBody.name !== categoryProduct.name
    ) {
      console.log(
        "son distintos: %s %s",
        categoryBody.name,
        categoryProduct.name
      );

      await categoryProduct.products.pull(product._id);
      await categoryProduct.save();

      await categoryBody.products.push(product._id);
      await categoryBody.save();

      product.category = categoryBody._id;
      await product.save();
    } else {
      console.log(
        "son iguales: %s %s",
        categoryBody.name,
        categoryProduct.name
      );
    }

    revalidatePath(`${Url}/admin/panel`);
    return {
      message: `El producto ${product.name} se editó perfectamente`,
    };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}` };
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

    await deleteFolder(`products/${category.name}/${product.name}`);

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
