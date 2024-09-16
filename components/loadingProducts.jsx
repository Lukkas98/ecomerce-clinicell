export default function LoadingProducts() {
  return (
    <div className="grid my-6 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse col-span-4">
      {Array(9)
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
  );
}
