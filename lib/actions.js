"use server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { auth } from "./firebaseConfig/firebaseConfig";
import { redirect } from "next/navigation";
import MercadoPagoConfig, { Preference } from "mercadopago";

const adminUID = process.env.ADMIN_UUID;
const Url = process.env.URL_FRONT;

export async function logAdmin(formData) {
  const oneDay = 24 * 60 * 60 * 1000;
  const user = formData.get("user");
  const pass = formData.get("pass");
  const userCredential = await signInWithEmailAndPassword(auth, user, pass);

  if (userCredential.user.uid !== adminUID) {
    console.error("No eres administrador logAdmin");
    throw new Error("Error");
  }
  console.log("admin conectado");

  cookies().set("admin", userCredential.user.uid, {
    secure: true,
    expires: Date.now() + oneDay,
  });
  redirect("/admin/panel");
}

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP,
});

export const payMP = async (items = []) => {
  const preference = await new Preference(client).create({
    body: {
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
      },
      // notification_url: `${Url}/home/Todos` ,
      back_urls: {
        success: `${Url}/home/Todos?success=true`,
        failure: `${Url}/home/Todos?failure=true`,
      },
      items: items.map((prod) => {
        return {
          id: prod._id,
          title: prod.name,
          picture_url: prod.images[0],
          description: prod.description,
          currency_id: "ARS",
          quantity: 1,
          unit_price: prod.price * 1.084,
        };
      }),
    },
  });
  // console.log("preference: ", preference);
  // redirect(preference.sandbox_init_point);
  // console.log("-------------------------------------------------");
  // console.log("Preference: ", preference);
  // console.log("-------------------------------------------------");
  redirect(preference.init_point);
};
