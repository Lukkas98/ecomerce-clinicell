export default function Loading() {
  return (
    <section className="min-h-[80vh] max-h-full min-w-screen">
      <div className="h-full overflow-hidden overflow-y-auto scrollbar-thin lg:grid animate-pulse">
        <div className="container grid my-6 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array(6)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className="border border-gray-600 rounded-lg bg-gray-500 p-4 shadow-md"
              >
                <div className="w-full h-40 bg-gray-500 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-500 rounded mb-2"></div>
                <div className="h-6 bg-gray-500 rounded mb-2"></div>
                <div className="h-6 bg-gray-500 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
