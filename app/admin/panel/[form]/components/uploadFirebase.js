import { app } from "@/lib/firebaseConfig/firebaseConfig";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

export default async function UploadFirebase(
  imageUrl = "",
  index,
  name,
  category
) {
  const storage = getStorage(app, `${process.env.NEXT_PUBLIC_URL_FIREBASE}`);

  const capName = name.charAt(0).toUpperCase() + name.slice(1);
  const capCategory = category.charAt(0).toUpperCase() + category.slice(1);

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Generar un nombre único para el archivo
  const fileName = `${capName}-${index}`;

  // Subir el archivo a Firebase Storage
  const storageRef = ref(
    storage,
    `productos/${capCategory}/${capName}/${fileName}`
  );
  await uploadBytes(storageRef, blob);

  const URL = await getDownloadURL(storageRef);
  return URL;
}
