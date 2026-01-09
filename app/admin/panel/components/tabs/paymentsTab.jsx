import BtnPayment from "../btnPayment";

export default function PaymentsTab({ data }) {
  return (
    <main className="mx-2 my-4">
      {["Pedidos pendientes", "Pedidos aprobados"].map((title, index) => (
        <details className="mb-6" key={index} open={!index}>
          <summary className="cursor-pointer text-xl font-semibold text-gray-100">
            {title}
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data
              ?.filter((payment) => payment.approved === !!index)
              .map((payment, i) => (
                <div
                  className={`${
                    payment.approved
                      ? "bg-green-800 text-gray-100 hover:bg-green-900"
                      : "bg-blue-900 text-white hover:bg-blue-950"
                  } mx-5 flex max-w-xl items-center justify-between rounded-lg px-3 py-2 shadow-md shadow-black transition-all`}
                  key={i}
                >
                  <div className="mb-3">
                    <p className="text-base font-semibold whitespace-nowrap">
                      {payment.id}
                    </p>
                    <div className="text-sm">
                      Pedido:{" "}
                      {payment.items.map((prod) => (
                        <span
                          key={prod.name}
                          className="font-medium text-gray-300"
                        >
                          {prod.units} {prod.name}--${prod.price * prod.units}
                          {payment.items.length > 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-sm">
                      Total:{" "}
                      <span className="text-base font-semibold text-green-400">
                        ${payment.total}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      {new Date(payment.updatedAt).toLocaleString("es-AR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {payment.approved && (
                      <span className="mt-2 block text-xs font-medium whitespace-nowrap text-gray-200 italic">
                        Se eliminará automáticamente en 7 días
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <BtnPayment
                      approved={payment.approved}
                      payment={JSON.parse(JSON.stringify(payment))}
                    />
                  </div>
                </div>
              ))}
          </div>
        </details>
      ))}
    </main>
  );
}
