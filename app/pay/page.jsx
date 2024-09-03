"use client";

import Image from "next/image";
import QrImage from "./components/qr";
import logo from "@/public/LogoPrueba.png";
import { headers } from "next/headers";

const isMobileDevice = () => {
  const userAgent = headers().get("user-agent") || "";
  return /Mobi|Android/i.test(userAgent);
};

export default function OrderConfirmation() {
  return (
    <section className="text-center">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        {/* Logo y Nombre del e-Commerce */}
        <div className="flex items-center mb-6">
          <Image
            width={70}
            height={70}
            src={logo ?? "https://fakeimg.pl/70x70"}
            alt="Logo Clinic-Cell"
            className="mr-3 rounded-lg"
          />
          <h1 className="text-3xl font-extrabold text-blue-600">Clinic-Cell</h1>
        </div>

        {/* Título Principal */}
        <h1 className="text-2xl font-bold text-center mb-6">
          ¡Falta poco para completar tu compra! 🎉
        </h1>

        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
          {!isMobileDevice() && (
            <>
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                📱 Escanea el código QR para confirmar tu compra en WhatsApp
              </h2>
              <p className="text-base text-gray-500 mb-4 text-center">
                Por favor haz click en el botón una vez mandes el mensaje.{" "}
                <br />
                Muchas gracias por confiar en nosotros 😊🙏
              </p>
            </>
          )}
          {isMobileDevice() && (
            <>
              <h2>
                Haz click en el botón para completar la compra por WhatsApp
              </h2>
              <p className="text-base text-gray-500 mb-4 text-center">
                Muchas gracias por confiar en nosotros 😊🙏
              </p>
            </>
          )}
          <QrImage isMovil={isMobileDevice()} />
        </div>
      </div>
    </section>
  );
}
