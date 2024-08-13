import { cookies } from "next/headers";
const adminId = process.env.ADMIN_UUID;

export default function checkAdmin() {
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");

  if (!admin || admin.value !== adminId) return false;

  return true;
}
