import { NextRequest } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP,
});

export async function POST(req = NextRequest) {
  const body = await req.json();

  const payment = await new Payment(client).get({ id: body.data.id });

  // console.log("payment: ", payment);

  const messageW = {
    id: payment.id,
    amount: payment.transaction_amount,
    date: payment.date_approved,
    message: payment.description,
    items: payment.additional_info.items,
    payer: payment.payer,
  };

  console.log("messageW: ", messageW);

  return Response.json({ success: true });
}
