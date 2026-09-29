import mongoose from "mongoose";
import {
  prop,
  getModelForClass,
  modelOptions,
  index,
  ReturnModelType,
  DocumentType,
} from "@typegoose/typegoose";

export const PAYMENT_EXPIRATION_SECONDS = 1209600;

@modelOptions({ schemaOptions: { _id: false } })
class PaymentItem {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true })
  public units!: number;
}

@index(
  { approvedAt: 1 },
  {
    expireAfterSeconds: PAYMENT_EXPIRATION_SECONDS,
    partialFilterExpression: { approved: true },
  },
)
@modelOptions({ schemaOptions: { timestamps: true, collection: "payments" } })
export class Payment {
  @prop({ type: () => [PaymentItem], required: true })
  public items!: { name: string; price: number; units: number }[];

  @prop({ required: true })
  public total!: number;

  @prop({ required: true, default: false })
  public approved!: boolean;

  @prop()
  public approvedAt?: Date;

  public createdAt!: Date;
  public updatedAt!: Date;
}

export type PaymentDocument = DocumentType<Payment>;
export type PaymentModelType = ReturnModelType<typeof Payment>;

export const PaymentModel: PaymentModelType =
  (mongoose?.models?.Payment as PaymentModelType) || getModelForClass(Payment);
