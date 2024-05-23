import app from "@/lib/firebaseConfig";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

export default async function UploadFirebase(images = [], name, category) {
  const storage = getStorage(app, `${process.env.NEXT_PUBLIC_URL_FIREBASE}`);

  let URLs = [];
  // Iterar sobre las URLs de las imágenes y subirlas a Firebase Storage
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Generar un nombre único para el archivo
    const fileName = `${name}-${i}`;

    // Subir el archivo a Firebase Storage
    const storageRef = ref(
      storage,
      `productos/${category}/${name}/${fileName}`
    );
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    // console.log("URL de la imagen:", downloadURL);
    URLs.push(downloadURL);
  }

  return URLs;
}
