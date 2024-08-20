export default function Loading() {
  return (
    <section className="min-h-[80vh] max-h-full min-w-screen z-10">
      <div className="h-full overflow-hidden overflow-y-auto scrollbar-thin lg:grid animate-pulse">
        <div className="grid my-6 gap-4 md:grid-cols-2">
          {Array(4)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-lg bg-gray-200 p-4 shadow-md"
              >
                <div className="w-full h-40 bg-gray-300 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
