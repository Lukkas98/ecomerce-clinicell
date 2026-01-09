import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const [ADMIN_USER, ADMIN_PASSWORD_HASH] = [
  process.env.ADMIN,
  process.env.PASSWORDHASH,
];

export async function createToken(user) {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function validateCredentials(user, password) {
  if (user !== ADMIN_USER) return false;
  console.log(ADMIN_PASSWORD_HASH);

  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.user === ADMIN_USER;
  } catch (error) {
    return false;
  }
}
