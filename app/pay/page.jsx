import Image from "next/image";
import QrImage from "./components/qr";
import logo from "@/public/logo.png";
import { headers } from "next/headers";
import Link from "next/link";

const isMobileDevice = async () => {
  "use server";
  const header = await headers();
  const userAgent = header.get("user-agent") || "";
  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
};

export default async function OrderConfirmation() {
  const isMobile = await isMobileDevice();

  return (
    <section className="bg-linear-to-b from-gray-900 to-gray-800 text-center">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-6 flex items-center">
          <Image
            width={70}
            height={70}
            src={logo}
            alt="Logo Clinic-Cell"
            className="mr-3 rounded-full border-2 border-blue-500 shadow-lg"
          />
          <h1 className="text-4xl font-extrabold text-blue-400">Clinic-Cell</h1>
        </div>

        <h2 className="mb-6 text-center text-2xl font-semibold text-white">
          ¡Falta poco para completar tu compra! 🎉
        </h2>

        <div className="flex w-full max-w-lg flex-col items-center rounded-lg bg-gray-800 p-6 shadow-xl">
          {isMobile ? (
            <>
              <h2 className="mb-2 text-lg font-medium text-gray-300">
                Haz click en el botón para completar la compra por WhatsApp
              </h2>
              <p className="mb-4 text-center text-sm leading-relaxed text-gray-400">
                Muchas gracias por confiar en nosotros 😊🤝
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-lg font-medium text-gray-300">
                📱 Escanea el código QR para confirmar tu compra en WhatsApp
              </h2>
              <p className="mb-4 text-center text-sm leading-relaxed text-gray-400">
                Por favor haz click en el botón una vez mandes el mensaje.{" "}
                <br />
                Muchas gracias por confiar en nosotros 😊🤝
              </p>
            </>
          )}

          <QrImage isMovil={isMobile} />
        </div>

        <Link
          className="mt-6 text-sm text-blue-400 underline hover:text-blue-300"
          href={"/"}
        >
          Volver a la tienda
        </Link>
      </div>
    </section>
  );
}
