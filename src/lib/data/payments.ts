import { PaymentModel } from "@/models/paymentModel";
import type { PaymentDTO, PaymentsDTO } from "@/lib/types/payments";
import { connection } from "next/server";
import connectDB from "../connectDB";

export async function getPayments(): Promise<PaymentsDTO> {
  await connection();
  await connectDB();

  const [pending, completed] = await Promise.all([
    PaymentModel.find({ approved: false }).sort({ createdAt: -1 }).lean(),
    PaymentModel.find({ approved: true }).sort({ approvedAt: -1 }).lean(),
  ]);

  return {
    pending: pending.map(serializePayment),
    completed: completed.map(serializePayment),
  };
}

function serializePayment(payment: {
  _id: { toString(): string };
  createdAt: Date;
  items: { name: string; price: number; units: number }[];
  total: number;
}): PaymentDTO {
  return {
    _id: payment._id.toString(),
    createdAt: payment.createdAt.toISOString(),
    items: payment.items.map(({ name, price, units }) => ({
      name,
      price,
      units,
    })),
    total: payment.total,
  };
}
