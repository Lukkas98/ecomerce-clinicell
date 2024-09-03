"use server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { auth } from "./firebaseConfig/firebaseConfig";
import { redirect } from "next/navigation";

const adminUID = process.env.ADMIN_UUID;

export async function logAdmin(formData) {
  const oneDay = 24 * 60 * 60 * 1000;
  const user = formData.get("user");
  const pass = formData.get("pass");
  const userCredential = await signInWithEmailAndPassword(auth, user, pass);

  if (userCredential.user.uid !== adminUID) {
    console.error("No eres administrador");
    throw new Error("No eres administrador");
  }
  console.log("admin conectado");

  cookies().set("admin", userCredential.user.uid, {
    secure: true,
    expires: Date.now() + oneDay,
  });
  redirect("/admin/panel");
}

export async function updateFirebaseURLs(images = [], newCategory, newFolder) {
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
