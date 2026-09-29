"use server";

import { PaymentModel } from "@/models/paymentModel";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { verifySession } from "../auth";
import connectDB from "../connectDB";

const paymentsPath = "/admin/payments";

function validatePaymentId(id: string) {
  if (!/^[\da-f]{24}$/i.test(id)) {
    throw new Error("El identificador del pago no es válido.");
  }

  return new Types.ObjectId(id);
}

export async function approvePayment(id: string) {
  if (!(await verifySession())) {
    throw new Error("No eres administrador.");
  }

  const paymentId = validatePaymentId(id);
  await connectDB();

  const result = await PaymentModel.updateOne(
    { _id: paymentId, approved: false },
    {
      $set: { approved: true },
      $currentDate: { approvedAt: true },
    },
  );

  if (result.modifiedCount !== 1) {
    throw new Error("El pago ya no está pendiente o no existe.");
  }

  revalidatePath(paymentsPath);
}

export async function deletePendingPayment(id: string) {
  if (!(await verifySession())) {
    throw new Error("No eres administrador.");
  }

  const paymentId = validatePaymentId(id);
  await connectDB();

  const result = await PaymentModel.deleteOne({
    _id: paymentId,
    approved: false,
  });

  if (result.deletedCount !== 1) {
    throw new Error("El pago ya no está pendiente o no existe.");
  }

  revalidatePath(paymentsPath);
}
