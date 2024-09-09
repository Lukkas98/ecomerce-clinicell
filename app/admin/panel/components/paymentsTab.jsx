import BtnPayment from "./btnPayment";

export default function PaymentsTab({ data }) {
  return (
    <main className="my-4 mx-2">
      {["Pedidos pendientes", "Pedidos aprobados"].map((title, index) => (
        <details className="mb-6" key={index} open={!index}>
          <summary className="font-semibold text-xl cursor-pointer">
            {title}
          </summary>
          <div className="grid gap-3 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {data
              ?.filter((payment) => payment.approved === !!index)
              .map((payment, i) => (
                <div
                  className={`${
                    payment.approved
                      ? "bg-green-300 hover:bg-green-400"
                      : "bg-orange-300 hover:bg-orange-400 hover:text-black"
                  } px-3 py-2 max-w-xl mx-5 rounded-lg shadow-black shadow transition-all flex justify-between items-center`}
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
                    <p>
                      {new Date(payment.updatedAt).toLocaleString("es-AR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {payment.approved && (
                        <span className="text-base inline-block font-bold">
                          Se eliminará automáticamente después de 7 días
                        </span>
                      )}
                    </p>
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
