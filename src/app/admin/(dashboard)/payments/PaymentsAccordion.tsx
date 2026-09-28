"use client";

import { approvePayment, deletePendingPayment } from "@/lib/actions/payments";
import { notifyError, notifySuccess } from "@/lib/notify";
import type { PaymentDTO } from "@/lib/types/payments";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Swal from "sweetalert2";

export default function PaymentsAccordion({
  pendingPayments,
  completedPayments,
  expirationDays,
}: {
  pendingPayments: PaymentDTO[];
  completedPayments: PaymentDTO[];
  expirationDays: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(
    null,
  );
  const [openSections, setOpenSections] = useState({
    pending: true,
    completed: false,
  });

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function runPaymentAction(id: string, action: "approve" | "delete") {
    setProcessingPaymentId(id);
    startTransition(async () => {
      try {
        if (action === "approve") {
          await approvePayment(id);
          await notifySuccess("Pago aceptado correctamente.");
        } else {
          await deletePendingPayment(id);
          await notifySuccess("Pago eliminado correctamente.");
        }
        router.refresh();
      } catch (error) {
        await notifyError(
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el pago.",
        );
      } finally {
        setProcessingPaymentId(null);
      }
    });
  }

  async function confirmDelete(id: string) {
    const result = await Swal.fire({
      title: "¿Eliminar este pago?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar pago",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      runPaymentAction(id, "delete");
    }
  }

  return (
    <div className="space-y-3">
      <PaymentSection
        id="pending"
        title="Pagos pendientes"
        description="Pagos que todavía no fueron confirmados"
        payments={pendingPayments}
        isOpen={openSections.pending}
        isPending={isPending}
        processingPaymentId={processingPaymentId}
        onApprove={(id) => runPaymentAction(id, "approve")}
        onDelete={confirmDelete}
        onToggle={() => toggleSection("pending")}
      />
      <PaymentSection
        id="completed"
        title="Pagos hechos"
        description="Historial de pagos confirmados"
        payments={completedPayments}
        isOpen={openSections.completed}
        isPending={isPending}
        expirationDays={expirationDays}
        processingPaymentId={processingPaymentId}
        onToggle={() => toggleSection("completed")}
      />
    </div>
  );
}

function PaymentSection({
  id,
  title,
  description,
  payments,
  isOpen,
  isPending,
  processingPaymentId,
  expirationDays,
  onToggle,
  onApprove,
  onDelete,
}: {
  id: "pending" | "completed";
  title: string;
  description: string;
  payments: PaymentDTO[];
  isOpen: boolean;
  isPending: boolean;
  processingPaymentId: string | null;
  expirationDays?: number;
  onToggle: () => void;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const panelId = `payments-${id}-panel`;
  const isPendingSection = id === "pending";

  return (
    <section className="dashboard-card overflow-hidden">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50/80"
        onClick={onToggle}
        type="button"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isPendingSection
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isPendingSection ? <ClockIcon /> : <CheckIcon />}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block text-sm font-bold text-slate-800"
            id={`payments-${id}-heading`}
          >
            {title}
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            {description}
          </span>
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
            isPendingSection
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {payments.length}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen ? (
        <div
          aria-labelledby={`payments-${id}-heading`}
          className="space-y-3 border-t border-slate-100 bg-slate-50/50 p-3 sm:p-4"
          id={panelId}
          role="region"
        >
          {!isPendingSection && expirationDays ? (
            <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-3.5 text-blue-900">
              <InfoIcon />
              <p className="text-xs leading-5">
                Los pagos hechos se eliminarán automáticamente{" "}
                <span className="font-bold">a los {expirationDays} días</span>{" "}
                desde su aprobación.
              </p>
            </div>
          ) : null}

          {payments.map((payment) => (
            <PaymentCard
              isBusy={isPending}
              isPending={isPendingSection}
              isProcessing={processingPaymentId === payment._id && isPending}
              key={payment._id}
              onApprove={
                isPendingSection ? () => onApprove?.(payment._id) : undefined
              }
              onDelete={
                isPendingSection ? () => onDelete?.(payment._id) : undefined
              }
              payment={payment}
            />
          ))}

          {payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <EmptyPaymentIcon />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-700">
                {isPendingSection
                  ? "No hay pagos pendientes"
                  : "Todavía no hay pagos hechos"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {isPendingSection
                  ? "Los nuevos pagos aparecerán aquí."
                  : "Los pagos aceptados aparecerán aquí."}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function PaymentCard({
  payment,
  isPending,
  isBusy,
  isProcessing,
  onApprove,
  onDelete,
}: {
  payment: PaymentDTO;
  isPending: boolean;
  isBusy: boolean;
  isProcessing: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">
          {formatDate(payment.createdAt)}
        </p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            isPending
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              isPending ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
          {isPending ? "Pendiente" : "Aprobado"}
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {payment.items.map((item, index) => (
          <li
            className="flex items-start justify-between gap-3 text-sm"
            key={`${payment._id}-${index}`}
          >
            <span className="min-w-0">
              <span className="block truncate font-semibold text-slate-700">
                {item.name}
              </span>
              <span className="mt-0.5 block text-xs text-slate-400">
                {item.units} {item.units === 1 ? "unidad" : "unidades"} ·{" "}
                {formatPrice(item.price)} c/u
              </span>
            </span>
            <span className="shrink-0 pt-0.5 text-xs font-medium text-slate-500">
              {formatPrice(item.price * item.units)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
        <span className="text-xs font-medium text-slate-500">
          Total del pago
        </span>
        <span className="text-base font-bold tracking-tight text-slate-900">
          {formatPrice(payment.total)}
        </span>
      </div>

      {isPending ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={isBusy}
            onClick={onApprove}
            type="button"
          >
            {isProcessing ? <ButtonLoader /> : <CheckIcon />}
            {isProcessing ? "Procesando..." : "Aceptar pago"}
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
            disabled={isBusy}
            onClick={onDelete}
            type="button"
          >
            <TrashIcon />
            Eliminar
          </button>
        </div>
      ) : null}
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-AR")}`;
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7v5l3.2 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="m6 12.5 4 4L18.5 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`shrink-0 text-slate-400 transition-transform ${
        isOpen ? "rotate-90" : ""
      }`}
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 shrink-0"
      fill="none"
      height="17"
      viewBox="0 0 24 24"
      width="17"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 11v5m0-8h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EmptyPaymentIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="19"
      viewBox="0 0 24 24"
      width="19"
    >
      <rect
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
        width="18"
        x="3"
        y="5"
      />
      <path
        d="M3 10h18m-14 5h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ButtonLoader() {
  return (
    <span
      aria-hidden="true"
      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
    />
  );
}
