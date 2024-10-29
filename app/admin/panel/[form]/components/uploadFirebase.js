import { app } from "@/lib/firebaseConfig/firebaseConfig";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

//convertir imagen a WebP usando canvas
async function convertToWebp(originalBlob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (webpBlob) => {
            const file = new File([webpBlob], "converted-image.webp", {
              type: "image/webp",
            });
            resolve(file);
          },
          "image/webp",
          0.9
        );
      };
    };
    reader.readAsDataURL(originalBlob);
  });
}

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
  const originalBlob = await response.blob();

  const webpFile = await convertToWebp(originalBlob);
  const fileName = `${capName}-${index}.webp`;

  const storageRef = ref(
    storage,
    `productos/${capCategory}/${capName}/${fileName}`
  );
  // console.log("webpFile: ", webpFile);
  await uploadBytes(storageRef, webpFile);

  const URL = await getDownloadURL(storageRef);
  return URL;
}
