import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const ADMIN_CREDENTIALS = JSON.parse(process.env.ADMINS || "[]");

export async function createToken(email) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export function validateCredentials(email, password) {
  return ADMIN_CREDENTIALS.some(
    (admin) => admin.email === email && admin.password === password
  );
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret);
    return ADMIN_CREDENTIALS.some((admin) => admin.email === payload.email);
  } catch (error) {
    return false;
  }
}
