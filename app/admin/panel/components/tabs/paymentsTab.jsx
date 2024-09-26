import BtnPayment from "../btnPayment";

export default function PaymentsTab({ data }) {
  return (
    <main className="my-4 mx-2">
      {["Pedidos pendientes", "Pedidos aprobados"].map((title, index) => (
        <details className="mb-6" key={index} open={!index}>
          <summary className="font-semibold text-xl text-gray-100 cursor-pointer">
            {title}
          </summary>
          <div className="grid gap-3 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {data
              ?.filter((payment) => payment.approved === !!index)
              .map((payment, i) => (
                <div
                  className={`${
                    payment.approved
                      ? "bg-green-800 hover:bg-green-900 text-gray-100"
                      : "bg-blue-800 hover:bg-blue-900 text-white"
                  } px-3 py-4 max-w-xl mx-5 rounded-lg shadow-lg transition-all flex justify-between items-center`}
                  key={i}
                >
                  <div className="mb-3">
                    <p className="font-semibold text-lg">{payment.id}</p>
                    <p className="text-sm">Productos: {payment.items.length}</p>
                    <p className="text-sm mt-2">
                      Total:{" "}
                      <span className="font-semibold text-base">
                        ${payment.total}
                      </span>
                    </p>
                    <p className="text-gray-300 mt-1">
                      {new Date(payment.updatedAt).toLocaleString("es-AR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {payment.approved && (
                      <span className="text-xs text-gray-200 font-medium italic mt-2 block">
                        Se eliminará automáticamente después de 7 días
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-center">
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
