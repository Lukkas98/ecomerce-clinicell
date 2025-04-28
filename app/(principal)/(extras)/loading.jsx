export default function Loading() {
  return (
    <section className="mb-6 gap-3 below-320:grid-cols-1 grid place-content-center">
      <div className="">
        <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4 animate-pulse"></div>

        <div className="below-320:col-span-1 col-span-2 flex justify-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-700 rounded animate-pulse"
            ></div>
          ))}
        </div>

        <div className="grid below-320:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-3 lg:mx-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg animate-pulse">
              <div className="aspect-square bg-gray-600 rounded-t-lg"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="below-320:col-span-1 col-span-2 lg:col-span-3 flex justify-center gap-2 mt-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-700 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
