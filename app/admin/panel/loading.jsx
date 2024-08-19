export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col animate-pulse">
      <nav className="bg-blue-700 text-white py-4 px-6 flex justify-between">
        <div className="w-32 h-6 bg-gray-300 rounded"></div>
        <div className="w-24 h-8 bg-blue-500 rounded-md"></div>
      </nav>

      <main className="flex-1 p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className="border border-gray-300 h-fit p-4 rounded-lg bg-gray-200 flex justify-between items-center shadow-black shadow-md"
            >
              <div className="w-[50%]">
                <div className="w-24 h-6 bg-gray-400 rounded mb-2"></div>
                <div className="relative w-20 aspect-square overflow-hidden rounded-md bg-gray-400"></div>
                <div className="flex w-full justify-between pt-4">
                  <div className="w-16 h-4 bg-gray-400 rounded"></div>
                  <div className="w-16 h-4 bg-gray-400 rounded"></div>
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-400 rounded-md"></div>
            </div>
          ))}
      </main>
    </div>
  );
}
