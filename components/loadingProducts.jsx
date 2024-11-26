export default function LoadingProducts() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="relative bg-gray-800 rounded-lg p-3 shadow shadow-black
             max-w-full w-full grid grid-cols-[96px,auto,20px] items-center
             border border-gray-700 place-items-center animate-pulse"
        >
          <div className="aspect-square w-24 bg-gray-700 rounded-md"></div>

          <div className="flex flex-col justify-between ml-4 w-full">
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>

          <div className="h-5 w-5 bg-gray-700 rounded-full"></div>

          <div className="flex gap-5 col-span-2 mt-3 place-self-center">
            <div className="w-12 h-6 bg-gray-700 rounded"></div>
            <div className="w-12 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
