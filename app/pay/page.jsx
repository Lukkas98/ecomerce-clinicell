import Image from "next/image";
import QrImage from "./components/qr";
import logo from "@/public/logo.png";
import { headers } from "next/headers";
import Link from "next/link";

const isMobileDevice = async () => {
  "use server";
  const header = await headers();
  const userAgent = header.get("user-agent") || "";
  return /Mobi|Android/i.test(userAgent);
};

export default async function OrderConfirmation() {
  const isMobile = await isMobileDevice();

  return (
    <section className="text-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* Logo y Nombre del e-Commerce */}
        <div className="flex items-center mb-6">
          <Image
            width={70}
            height={70}
            src={logo ?? "https://fakeimg.pl/70x70"}
            alt="Logo Clinic-Cell"
            className="mr-3 rounded-full border-2 border-blue-500 shadow-lg"
          />
          <h1 className="text-4xl font-extrabold text-blue-400">Clinic-Cell</h1>
        </div>

        {/* Título Principal */}
        <h1 className="text-2xl font-semibold text-center mb-6 text-white">
          ¡Falta poco para completar tu compra! 🎉
        </h1>

        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
          {isMobile ? (
            <>
              <h2 className="text-lg font-medium text-gray-300 mb-2">
                Haz click en el botón para completar la compra por WhatsApp
              </h2>
              <p className="text-sm text-gray-400 mb-4 text-center leading-relaxed">
                Muchas gracias por confiar en nosotros 😊🤝
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium text-gray-300 mb-2">
                📱 Escanea el código QR para confirmar tu compra en WhatsApp
              </h2>
              <p className="text-sm text-gray-400 mb-4 text-center leading-relaxed">
                Por favor haz click en el botón una vez mandes el mensaje.{" "}
                <br />
                Muchas gracias por confiar en nosotros 😊🤝
              </p>
            </>
          )}

          <QrImage isMovil={isMobile} />
        </div>

        <Link
          className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline"
          href={"/"}
        >
          Volver a la tienda
        </Link>
      </div>
    </section>
  );
}
