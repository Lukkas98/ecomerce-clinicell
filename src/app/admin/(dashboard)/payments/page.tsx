import { getPayments } from "@/lib/data/payments";
import { PAYMENT_EXPIRATION_SECONDS } from "@/models/paymentModel";
import { Suspense } from "react";
import PaymentsAccordion from "./PaymentsAccordion";

const paymentExpirationDays = PAYMENT_EXPIRATION_SECONDS / (24 * 60 * 60);

function PaymentsLoading() {
  return (
    <div className="dashboard-card p-8 text-center text-sm text-slate-500">
      Cargando pagos...
    </div>
  );
}

async function PaymentsContent() {
  const payments = await getPayments();

  return (
    <PaymentsAccordion
      completedPayments={payments.completed}
      expirationDays={paymentExpirationDays}
      pendingPayments={payments.pending}
    />
  );
}

export default function PaymentsPage() {
  return (
    <div className="dashboard-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Revisa los pagos recibidos y consulta su estado.
        </p>
      </div>
      <Suspense fallback={<PaymentsLoading />}>
        <PaymentsContent />
      </Suspense>
    </div>
  );
}
