import Link from "next/link";

export default function Login() {
  return (
    <>
      <form action="">
        <input type="text" placeholder="admin" />
        <input type="password" name="" id="" />
      </form>
      <Link href={"/admin/products"}>Loguear</Link>
    </>
  );
}
