import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const adminCookieName = "adminToken";
const sessionDurationSeconds = 2 * 60 * 60;

function getAuthConfiguration() {
  const adminUser = process.env.ADMIN;
  const adminPasswordHash = process.env.PASSWORDHASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUser || !adminPasswordHash || !jwtSecret) {
    throw new Error("Falta configurar el acceso de administrador.");
  }

  return {
    adminUser,
    adminPasswordHash,
    jwtSecret: new TextEncoder().encode(jwtSecret),
  };
}

export async function createToken(user: string) {
  const { jwtSecret } = getAuthConfiguration();

  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(jwtSecret);
}

export async function validateCredentials(user: unknown, password: unknown) {
  if (typeof user !== "string" || typeof password !== "string") {
    return false;
  }

  const { adminUser, adminPasswordHash } = getAuthConfiguration();
  if (user !== adminUser) return false;

  return bcrypt.compare(password, adminPasswordHash);
}

export async function verifySession() {
  const token = (await cookies()).get(adminCookieName)?.value;
  if (!token) return false;

  try {
    const { adminUser, jwtSecret } = getAuthConfiguration();
    const { payload } = await jwtVerify(token, jwtSecret);
    return payload.user === adminUser;
  } catch {
    return false;
  }
}

export { adminCookieName, sessionDurationSeconds };
