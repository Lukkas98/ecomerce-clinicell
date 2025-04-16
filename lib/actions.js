"use server";
import { cookies } from "next/headers";
import { createToken, validateCredentials } from "./auth";

export async function logAdmin(__currentState, formData) {
  try {
    const email = formData.get("user");
    const password = formData.get("pass");

    if (!validateCredentials(email, password)) {
      return {
        admin: false,
        message: "Credenciales inválidas",
      };
    }

    const token = await createToken(email);

    const cookieStore = await cookies();
    cookieStore.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2,
    });

    return {
      admin: true,
      message: "Ingresando...",
      href: "/admin/panel",
    };
  } catch (error) {
    return {
      admin: false,
      message: "Error en la autenticación",
    };
  }
}
