"use server";
import { verifySession } from "@/lib/auth";
import { cloudinaryUploader } from "@/lib/cloudinary-config";
import { revalidatePath } from "next/cache";

export const uploadToCloudinary = async (
  base64Image,
  index,
  name,
  category
) => {
  try {
    if (!(await verifySession()))
      throw new Error("No tienes permisos para subir imagenes");

    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    const capNameTrimmed = capName.trim();
    const capCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const fileName = `${capNameTrimmed}-${index}`;

    const result = await cloudinaryUploader.upload(base64Image, {
      public_id: fileName,
      format: "webp",
      transformation: [{ quality: "auto", fetch_format: "webp" }],
      overwrite: true,
      folder: `${capCategory.trim()}/${capNameTrimmed}`,
    });

    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  } finally {
    revalidatePath("/home", "page");
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!(await verifySession()))
      throw new Error("No tienes permisos para eliminar imagenes");

    const result = await cloudinaryUploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
      type: "upload",
    });

    // Considerar "not found" como éxito para eliminar de la UI
    if (result.result === "not found") {
      // console.log("Imagen no existente en Cloudinary");
      return { success: true };
    }

    return { success: result.result === "ok" };
  } catch (error) {
    console.error("Error deleting:", error);
    return {
      success: false,
      message: error.message.replace("Cloudinary error: ", ""),
    };
  } finally {
    revalidatePath("/home", "page");
  }
};
