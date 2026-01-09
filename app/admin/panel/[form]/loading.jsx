export default function Loading() {
  return (
    <div className="mx-4 my-8 max-w-5xl animate-pulse rounded-lg border border-gray-700 bg-gray-700 p-3 shadow-lg lg:mx-auto">
      <div className="inline-block h-8 w-24 rounded-lg bg-gray-600 px-4 py-2"></div>

      <h2 className="mx-auto my-6 h-6 w-48 rounded bg-gray-600 text-center text-xl font-bold"></h2>

      <div className="rounded-lg p-1 shadow-md">
        {/* Esqueleto del formulario */}
        <div className="mx-auto flex w-full flex-col gap-6 rounded-lg bg-gray-800 px-4 py-4 shadow-lg">
          <div className="flex flex-col">
            <div className="h-10 w-full rounded bg-gray-700"></div>
            <span className="mt-1 h-4 w-1/3 rounded bg-gray-600"></span>
          </div>

          <div className="flex flex-col">
            <div className="h-10 w-full rounded bg-gray-700"></div>
            <span className="mt-1 h-4 w-1/3 rounded bg-gray-600"></span>
          </div>

          <div className="flex flex-col">
            <div className="h-32 w-full rounded bg-gray-700"></div>
            <span className="mt-1 h-4 w-1/3 rounded bg-gray-600"></span>
          </div>

          <div className="flex flex-col">
            <div className="h-10 w-full rounded bg-gray-700"></div>
            <span className="mt-1 h-4 w-1/3 rounded bg-gray-600"></span>
          </div>

          <div className="w-full">
            <div className="h-10 rounded bg-gray-700"></div>
            <div className="mt-4 flex flex-wrap gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative mt-5">
                  <div className="relative aspect-square w-20 rounded-lg bg-gray-700 shadow-md"></div>
                  <div className="absolute -top-5 right-0 z-10 h-6 w-6 rounded bg-gray-600 px-2"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-10 w-full rounded bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
