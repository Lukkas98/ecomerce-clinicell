"use server";
import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { revalidatePath } from "next/cache";
import checkAdmin from "../firebaseConfig/checkAdmin";
import { deleteFolder } from "./products";

const Url = process.env.URL_FRONT;

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
    const category = await CategoryModel.findOne({
      name: { $regex: name, $options: "i" },
    }).populate("products");

    if (!category) throw new Error(`La categoria %s no existe`, name);

    return category;
  } catch (error) {
    return error.message;
  }
};

export async function createCategory(name) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");
    await connectDB();

    let categoryObj = await CategoryModel.findOne({
      name: { $regex: name, $options: "i" },
    });
    if (categoryObj)
      throw Error("Esa categoria ya existe, prueba con otro nombre");

    categoryObj = await CategoryModel.create({
      name,
      products: [],
    });

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return { message: `Categoria ${categoryObj.name} creada`, success: true };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function DeleteCategory(id) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");
    await connectDB();

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      throw new Error(`La categoria id: %s no existe`, id);
    }

    await category.products.forEach(async (product) => {
      await ProductModel.findByIdAndDelete(product._id);
    });
    await deleteFolder(`productos/${category.name}/`);

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return {
      message: `La categoria ${category.name} se borro exitosamente.
      Se eliminaron ${category.products.length} productos`,
      success: true,
    };
  } catch (error) {
    return { message: `${err.message}`, success: false };
  }
}
