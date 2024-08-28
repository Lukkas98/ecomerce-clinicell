import { app } from "@/lib/firebaseConfig/firebaseConfig";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

export default async function UploadFirebase(
  imageUrl = "",
  index,
  name,
  category
) {
  const storage = getStorage(app, `${process.env.NEXT_PUBLIC_URL_FIREBASE}`);

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Generar un nombre único para el archivo
  const fileName = `${name}-${index}`;

  // Subir el archivo a Firebase Storage
  const storageRef = ref(storage, `productos/${category}/${name}/${fileName}`);
  await uploadBytes(storageRef, blob);

  const URL = await getDownloadURL(storageRef);
  return URL;
}
