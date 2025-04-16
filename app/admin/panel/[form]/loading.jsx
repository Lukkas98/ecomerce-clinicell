export default function Loading() {
  return (
    <div className="border border-gray-700 p-3 rounded-lg bg-gray-700 shadow-lg mx-4 my-8 max-w-5xl lg:mx-auto animate-pulse">
      <div className="inline-block px-4 py-2 bg-gray-600 rounded-lg w-24 h-8"></div>

      <h2 className="text-xl font-bold my-6 text-center bg-gray-600 h-6 rounded w-48 mx-auto"></h2>

      <div className="p-1 rounded-lg shadow-md">
        {/* Esqueleto del formulario */}
        <div className="flex flex-col gap-6 w-full mx-auto px-4 py-4 bg-gray-800 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <div className="w-full h-10 bg-gray-700 rounded"></div>
            <span className="h-4 bg-gray-600 rounded mt-1 w-1/3"></span>
          </div>

          <div className="flex flex-col">
            <div className="w-full h-10 bg-gray-700 rounded"></div>
            <span className="h-4 bg-gray-600 rounded mt-1 w-1/3"></span>
          </div>

          <div className="flex flex-col">
            <div className="w-full h-32 bg-gray-700 rounded"></div>
            <span className="h-4 bg-gray-600 rounded mt-1 w-1/3"></span>
          </div>

          <div className="flex flex-col">
            <div className="w-full h-10 bg-gray-700 rounded"></div>
            <span className="h-4 bg-gray-600 rounded mt-1 w-1/3"></span>
          </div>

          <div className="w-full">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="mt-4 flex flex-wrap gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative mt-5">
                  <div className="relative w-20 aspect-square bg-gray-700 rounded-lg shadow-md"></div>
                  <div className="absolute z-10 bg-gray-600 rounded px-2 right-0 -top-5 h-6 w-6"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
