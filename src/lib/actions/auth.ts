"use server";

import {
  createToken,
  sessionDurationSeconds,
  validateCredentials,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminLoginState = {
  message: string;
} | null;

export async function logAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const user = formData.get("user");
  const password = formData.get("pass");

  try {
    if (!(await validateCredentials(user, password))) {
      return { message: "Usuario o contraseña incorrectos." };
    }
  } catch (error) {
    console.error("No se pudo validar el acceso de administrador.", error);
    return {
      message:
        "No se pudo validar el acceso. Revisá la configuración del administrador.",
    };
  }

  if (typeof user !== "string") {
    return { message: "Usuario o contraseña incorrectos." };
  }

  try {
    const token = await createToken(user);
    (await cookies()).set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: sessionDurationSeconds,
      path: "/",
    });
  } catch (error) {
    console.error("No se pudo iniciar la sesión de administrador.", error);
    return {
      message:
        "No se pudo iniciar sesión. Revisá la configuración del administrador.",
    };
  }

  redirect("/admin/products");
}
