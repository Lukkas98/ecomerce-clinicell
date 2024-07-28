"use server"
import { CategoryModel } from "@/models/category";
import connectDB from "../ConectDB";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const adminId = process.env.ADMIN_UUID;
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
    const category = await CategoryModel.findOne({ name: name }).populate(
      "products"
    );

    if (!category) throw new Error(`La categoria %s no existe`, name);

    return category;
  } catch (error) {
    return error.message;
  }
};

export async function createCategory(name) {
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");

  try {
    if (!admin || admin.value !== adminId) throw Error("No eres administrador");

    let categoryObj = await CategoryModel.findOne({ name: name });
    if (categoryObj) throw Error("Esa categoria ya existe");

    categoryObj = await CategoryModel.create({
      name,
      products: [],
    });

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return { message: "Categoria creada" };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}` };
  }
}
