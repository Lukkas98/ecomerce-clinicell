"use client";
import { CartContext } from "@/components/(header)/(cart)/cartProvider";
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
    const productList = cart.items?.map((product) => product.name).join(", ");
    const totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);
    const message = `_Hola! Quiero confirmar mi compra:_
*#${orderId}* por *$${totalAmount}*.
Productos: ${productList}.`;

    const link = `https://wa.me/5491131297950?text=${encodeURIComponent(
      message
    )}`;
    setWhatsappLink(link);
    QRcode.toDataURL(link).then(setQr);
    console.log("useEffect: ", link);
  }, [orderId, cart]);

  const handleOnClick = () => {
    Swal.fire({
      icon: "info",
      title: "Redirigiendo a WhatsApp Web",
      text: "Por favor, recuerda volver para confirmar el envío del mensaje.",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
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
            <Image
              width={200}
              height={200}
              src={qr}
              alt="QR para confirmar tu compra por WhatsApp"
            />
            <p className="text-xs text-gray-500">Pedido: {orderId}</p>
            <p className="text-sm text-gray-600 font-medium">
              ¿No puedes escanear?, haz click{" "}
              <button
                onClick={handleOnClick}
                rel="noopener noreferrer"
                title="Abir WhatsApp web"
                className="text-blue-500"
              >
                aquí
              </button>
            </p>
          </>
        )}
      </div>
      <ButtonPay
        isMobile={isMovil}
        data={{ orderId, cart }}
        dispatch={dispatch}
      />
    </>
  );
}
