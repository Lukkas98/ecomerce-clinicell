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
  const [qr, setQr] = useState("https://dummyimage.com/200x200");

  const orderId = useMemo(() => generateSimpleOrderId(), []);

  const link = useMemo(() => {
    const productList = cart.items
      .map(
        (prod) =>
          `${prod.unitsInCart} ${prod.name}--$${
            prod.price * prod.unitsInCart
          }\n`,
      )
      .join("");
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.unitsInCart,
      0,
    );
    const message = `Hola! Quiero confirmar mi compra: *#${orderId}* por *$${totalAmount}*\nPedido:\n${productList}`;
    return `https://wa.me/5492657210777?text=${encodeURIComponent(message)}`;
  }, [orderId, cart]);

  useEffect(() => {
    QRcode.toDataURL(link).then(setQr);
  }, [link]);

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
        window.open(link, "_blank");
      },
    });
  };

  return (
    <>
      <div className="mb-6 flex w-[80%] flex-col items-center justify-center">
        {!isMovil && (
          <>
            <div className="rounded-lg bg-gray-700 p-4 shadow-lg">
              <Image
                width={200}
                height={200}
                src={qr}
                alt="QR para confirmar tu compra por WhatsApp"
                className="rounded-lg"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">Pedido: {orderId}</p>
            <p className="text-sm font-medium text-gray-300">
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
        whatsappLink={link}
      />
    </>
  );
}
