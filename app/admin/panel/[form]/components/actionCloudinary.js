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
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    const capCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const fileName = `${capName}-${index}`;

    const publicId = `${fileName}`;

    const result = await cloudinaryUploader.upload(base64Image, {
      public_id: publicId,
      format: "webp",
      transformation: [{ quality: "auto", fetch_format: "webp" }],
      overwrite: true,
      folder: `${capCategory}/${capName}`,
    });

    return { url: result.secure_url, publicId };
  } catch (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  } finally {
    revalidatePath("/home", "page");
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!verifySession())
      throw new Error("No tienes permisos para eliminar imagenes");

    if (!imageUrl.includes("res.cloudinary.com")) return { success: true };

    const decodedUrl = decodeURIComponent(imageUrl);
    const cleanUrl = decodedUrl.replace(/\/v\d+/, "").split("?")[0];
    const uploadIndex = cleanUrl.indexOf("/upload/") + 8;
    const publicId = cleanUrl.slice(uploadIndex).split(".")[0];

    const result = await cloudinaryUploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
      type: "upload",
    });

    // Considerar "not found" como éxito para eliminar de la UI
    if (result.result === "not found") {
      console.log("Imagen no existente en Cloudinary");
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
