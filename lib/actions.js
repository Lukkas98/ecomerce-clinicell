"use server";

import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import connectDB from "./ConectDB";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
const Url = process.env.URL_FRONT;

export const logAdmin = async (formData) => {
  const user = formData.get("user");
  const pass = formData.get("pass");

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASS;
  const adminTrue = process.env.ADMIN_TRUE;

  const oneDay = 24 * 60 * 60 * 1000;
  if (user === adminUser && pass === adminPassword) {
    cookies().set("admin", adminTrue, {
      secure: true,
      expires: Date.now() + oneDay,
    });
    redirect(`${Url}/admin/panel`);
  } else {
    cookies().set("admin", "false", {
      secure: true,
      expires: Date.now() + oneDay,
    });
    redirect(`${Url}/admin`);
  }
};

export const getCategories = async (isFront = false) => {
  try {
    await connectDB();
    const categories = isFront
      ? await CategoryModel.find({}).lean()
      : await CategoryModel.find({});

    if (!categories) {
      throw new Error("No hay Categorias");
    }

    if (isFront) {
      const jsonString = JSON.stringify(categories);
      const objJson = await JSON.parse(jsonString);
      return objJson;
    }

    return categories;
  } catch (error) {
    return error.message;
  }
};

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

export const getCategoryId = async (id) => {
  try {
    await connectDB();
    const category = await CategoryModel.findById(id).populate("products");

    if (!category) {
      throw new Error(`La categoria id: %s no existe`, id);
    }

    return category;
  } catch (error) {
    return error.message;
  }
};

export const getCategoryName = async (name) => {
  try {
    await connectDB();
    const category = await CategoryModel.findOne({ name: name }).populate(
      "products"
    );

    if (!category) {
      throw new Error(`La categoria %s no existe`, name);
    }

    return category;
  } catch (error) {
    return error.message;
  }
};

export async function createProduct(formData, urls) {
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");

  try {
    if (!admin || admin.value !== process.env.ADMIN_TRUE)
      throw Error("No eres administrador");

    await connectDB();
    const { name, price, stock, description, category } = formData;

    //reviso si la categoria existe o no
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
    return "Producto creado";

    // return revalidatePath(`${URL}/admin/panel/create?success=producto creado exitosamente`);
  } catch (err) {
    return JSON.parse(JSON.stringify(err.message));
  }
}
