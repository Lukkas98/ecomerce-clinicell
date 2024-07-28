"use server"
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { cookies } from "next/headers";
import { CategoryModel } from "@/models/category";
import { revalidatePath } from "next/cache";

const adminId = process.env.ADMIN_UUID;
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
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");

  try {
    if (!admin || admin.value !== adminId) throw Error("No eres administrador");

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
    return { message: "Producto creado" };
  } catch (err) {
    return { message: `${err.message}` };
  }
}

export async function editProduct(dataProduct) {
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");

  try {
    if (!admin || admin.value !== adminId)
      throw new Error("No eres administrador");

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
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");

  try {
    if (!admin || admin.value !== adminId)
      throw new Error("No eres administrador");

    const product = await ProductModel.findByIdAndDelete(productId);

    if (!product) throw new Error(`El producto a borrar no existe`);

    // Elimina el producto de la categoría también
    await CategoryModel.findByIdAndUpdate(product.category, {
      $pull: { products: product._id },
    });

    revalidatePath(`${Url}/admin/panel`);
    return { message: `Producto ${product.name} borrado` };
  } catch (error) {
    console.error(error);
    return { message: `${error.message}` };
  }
}
