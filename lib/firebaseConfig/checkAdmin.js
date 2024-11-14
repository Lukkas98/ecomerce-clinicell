import { cookies } from "next/headers";
const adminId = process.env.ADMIN_UUID;

export default async function checkAdmin() {
  const cookieStore = await cookies();
  const admin = cookieStore.get("admin");

  if (!admin || admin.value !== adminId) return false;

  return true;
}
