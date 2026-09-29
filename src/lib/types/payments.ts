export type PaymentDTO = {
  _id: string;
  createdAt: string;
  items: { name: string; price: number; units: number }[];
  total: number;
};

export type PaymentsDTO = {
  pending: PaymentDTO[];
  completed: PaymentDTO[];
};
