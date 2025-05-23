"use server";
import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { revalidatePath } from "next/cache";
import { verifySession } from "../auth";

export const getCategories = async (isFront = false) => {
  try {
    await connectDB();
    const categories = isFront
      ? await CategoryModel.find({}).lean().sort({ name: 1 })
      : await CategoryModel.find({}).sort({ name: 1 });

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
    const category = await CategoryModel.findById(id);

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
    });

    if (!category) throw new Error(`La categoria %s no existe`, name);

    return category;
  } catch (error) {
    return error.message;
  }
};

export async function createCategory(__currentState, formData) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");
    await connectDB();

    const category = Object.fromEntries(formData.entries());
    const isParent = category.hasOwnProperty("parentCategory");
    const { name, parentCategory } = category;

    if (!name.trim()) throw Error("El nombre no puede estar vacío");

    //si existe el campo parentCategory, significa que es una subcategoria
    if (isParent && !parentCategory)
      throw Error(
        "Debes seleccionar una categoría principal para la subcategoría."
      );

    let categoryObj = await CategoryModel.findOne({
      name: { $regex: name, $options: "i" },
    });
    if (categoryObj)
      throw Error("Esa categoria ya existe, prueba con otro nombre");

    categoryObj = await CategoryModel.create({
      name,
      products: [],
      parentCategory: parentCategory ?? null,
    });

    revalidatePath(`/`, "layout");
    return {
      message: `Categoría: ${categoryObj.name} creada ${
        isParent ? "como subcategoria" : "como principal"
      }`,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function DeleteCategory(id) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");
    await connectDB();

    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) throw new Error(`La categoría id: ${id} no existe`);

    const deleteProductPromises = category.products.map(async (productId) => {
      await ProductModel.findByIdAndDelete(productId);
    });
    await Promise.all(deleteProductPromises);

    revalidatePath(`/`, "layout");
    return {
      message: `La categoría ${category.name} se borró exitosamente. 
Se eliminaron ${category.products.length} productos.`,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return { message: `${error.message}`, success: false };
  }
}

export const editCategory = async (id, newName) => {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");
    await connectDB();

    const category = await CategoryModel.findById(id);
    if (!category) throw new Error("La categoría no existe");

    category.name = newName;
    await category.save();

    revalidatePath(`/`, "layout");
    return { message: `Categoría actualizada`, success: true };
  } catch (error) {
    return { message: `${error.message}`, success: false };
  }
};
