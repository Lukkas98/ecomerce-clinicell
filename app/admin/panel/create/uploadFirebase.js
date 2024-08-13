"use server";

import { app } from "@/lib/firebaseConfig/firebaseConfig";
import axios from "axios";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

export default async function UploadFirebase(images = [], name, category) {
  const storage = getStorage(app, `${process.env.NEXT_PUBLIC_URL_FIREBASE}`);

  let URLs = [];
  // Iterar sobre las URLs de las imágenes y subirlas a Firebase Storage
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];

    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");

      const fileName = `${name}-${i}`;
      const storageRef = ref(
        storage,
        `productos/${category}/${name}/${fileName}`
      );
      await uploadBytes(storageRef, buffer);

      const downloadURL = await getDownloadURL(storageRef);
      URLs.push(downloadURL);
    } catch (error) {
      console.error(`Error fetching or uploading ${imageUrl}:`, error);
    }
  }

  return URLs;
}
