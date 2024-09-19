export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col animate-pulse">
      <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between">
        <div className="w-32 h-6 bg-gray-600 rounded-md"></div>
        <div className="w-24 h-8 bg-blue-500 rounded-md"></div>
      </nav>
      <main className="flex-1 p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className="border border-gray-700 bg-gray-800 p-4 rounded-lg flex flex-col items-center shadow-md"
            >
              <div className="w-3/4 h-6 bg-gray-600 rounded-md mb-4"></div>
              <div className="relative w-28 aspect-square bg-gray-600 rounded-md mb-4"></div>
              <div className="flex w-full justify-between px-4 mb-4">
                <div className="w-20 h-4 bg-gray-600 rounded-md"></div>
                <div className="w-20 h-4 bg-gray-600 rounded-md"></div>
              </div>
              <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
            </div>
          ))}
      </main>
    </div>
  );
}
