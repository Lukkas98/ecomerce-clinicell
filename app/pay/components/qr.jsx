"use client";
import { CartContext } from "@/components/providers/cartProvider";
import { useContext, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import QRcode from "qrcode";
import ButtonPay from "./buttonPay";
import Swal from "sweetalert2";

const generateSimpleOrderId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${randomNumber}`;
};

export default function QrImage({ isMovil }) {
  const { cart, dispatch } = useContext(CartContext);
  const [qr, setQr] = useState("https://fakeimg.pl/200x200");
  const [whatsappLink, setWhatsappLink] = useState("#");

  // Generate the orderId only once
  const orderId = useMemo(generateSimpleOrderId, []);

  useEffect(() => {
    const productList = cart.items
      .map(
        (prod) =>
          `${prod.unitsInCart} ${prod.name}--$${
            prod.price * prod.unitsInCart
          }\n`
      )
      .join("");
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.unitsInCart,
      0
    );
    const message = `Hola! Quiero confirmar mi compra: *#${orderId}* por *$${totalAmount}*\nPedido:\n${productList}`;

    const link = `https://wa.me/5492657210777?text=${encodeURIComponent(
      message
    )}`;
    setWhatsappLink(link);
    QRcode.toDataURL(link).then(setQr);
  }, [orderId, cart]);

  const handleOnClick = () => {
    Swal.fire({
      icon: "info",
      title: "Redirigiendo a WhatsApp Web",
      text: "Por favor, recuerda volver para confirmar el envío del mensaje.",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#374151",
      color: "#E5E7EB",
      willClose: () => {
        window.open(whatsappLink, "_blank");
      },
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-[80%] mb-6">
        {!isMovil && (
          <>
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <Image
                width={200}
                height={200}
                src={qr}
                alt="QR para confirmar tu compra por WhatsApp"
                className="rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Pedido: {orderId}</p>
            <p className="text-sm text-gray-300 font-medium">
              ¿No puedes escanear? Haz click{" "}
              <button
                onClick={handleOnClick}
                rel="noopener noreferrer"
                title="Abrir WhatsApp web"
                className="text-blue-400 hover:text-blue-300"
              >
                aquí
              </button>
            </p>
          </>
        )}
      </div>
      {isMovil && <p className="text-sm text-gray-400">Pedido: {orderId}</p>}
      <ButtonPay
        isMobile={isMovil}
        data={{ orderId, cart }}
        dispatch={dispatch}
        whatsappLink={whatsappLink}
      />
    </>
  );
}
