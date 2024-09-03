import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    approved: {
      type: Boolean,
      required: true,
      default: false,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

PaymentSchema.index(
  { approvedAt: 1 },
  {
    expireAfterSeconds: 604800, // 7 días = 604800 segundos
    partialFilterExpression: { approved: true },
  }
);

export const PaymentModel =
  mongoose?.models?.Payment || mongoose.model("Payment", PaymentSchema);
