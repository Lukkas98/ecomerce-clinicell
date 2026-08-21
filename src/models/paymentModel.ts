import mongoose from "mongoose";
import {
  prop,
  getModelForClass,
  modelOptions,
  index,
  ReturnModelType,
  DocumentType,
} from "@typegoose/typegoose";

@index(
  { approvedAt: 1 },
  { expireAfterSeconds: 1209600, partialFilterExpression: { approved: true } },
)
@modelOptions({ schemaOptions: { timestamps: true, collection: "payments" } })
export class Payment {
  @prop({
    type: () => [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        units: { type: Number, required: true },
      },
    ],
    required: true,
    _id: false,
  })
  public items!: { name: string; price: number; units: number }[];

  @prop({ required: true })
  public total!: number;

  @prop({ required: true, default: false })
  public approved!: boolean;

  @prop()
  public approvedAt?: Date;
}

export type PaymentDocument = DocumentType<Payment>;
export type PaymentModelType = ReturnModelType<typeof Payment>;

export const PaymentModel: PaymentModelType =
  (mongoose?.models?.Payment as PaymentModelType) || getModelForClass(Payment);
