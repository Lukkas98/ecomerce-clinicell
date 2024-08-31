"use server";
import connectDB from "../ConectDB";
import { revalidatePath } from "next/cache";
import checkAdmin from "../firebaseConfig/checkAdmin";
import { PaymentModel } from "@/models/payments";

export const getAllPayments = async () => {
  try {
    await connectDB();
    const response = await PaymentModel.find({});

    // if (!response.length) throw new Error("No hay pedidos");

    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export const createPay = async (payData) => {
  const { orderId, items, total } = payData;
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");
    await connectDB();

    const itemsToModel = items.map((item) => {
      return {
        name: item.name,
        price: item.price,
      };
    });

    await PaymentModel.create({
      id: orderId,
      items: itemsToModel,
      total,
      approved: false,
      approvedAt: new Date(),
    });
    revalidatePath(`/admin/panel`);
    return {
      success: true,
      message: `Orden #${orderId} confirmada`,
      to: "/home/Todos",
    };
  } catch (error) {
    return { success: false, message: `${error.message}` };
  }
};

export const approvePay = async (id = "") => {
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");
    await connectDB();

    const payment = await PaymentModel.findOne({ id });
    if (!payment) throw new Error("El pago no existe");
    if (payment.approved) throw new Error("El pago ya está aprobado");

    payment.approved = true;
    payment.approvedAt = new Date();
    await payment.save();

    revalidatePath(`/admin/panel`);
    return { success: true, message: `Orden ${payment.id} aceptada` };
  } catch (error) {
    return { success: false, message: `${error.message}` };
  }
};

export const deletePay = async (id) => {
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");
    await connectDB();

    const payment = await PaymentModel.findByIdAndDelete(id);
    if (!payment) throw new Error(`La orden ${id} no existe`);

    revalidatePath(`/admin/panel`);
    return { success: true, message: `Orden ${payment.id} eliminada` };
  } catch (error) {
    return { success: false, message: `${error.message}` };
  }
};
