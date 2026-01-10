export default function Loading() {
  return (
    <section className="mx-auto animate-pulse p-4 lg:w-full">
      <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
        <div className="w-full max-w-112.5">
          <div className="h-80 w-full rounded-md bg-gray-300 md:h-96"></div>
        </div>
        <div className="mt-4 w-full md:mt-0 md:w-1/2">
          <div className="mb-4 h-8 w-3/4 rounded-md bg-gray-300"></div>
          <div className="mb-4 h-6 w-1/2 rounded-md bg-gray-300"></div>
          <div className="mb-6 h-4 w-1/4 rounded-md bg-gray-300"></div>
          <div className="mb-6 h-12 w-full rounded-md bg-gray-300 md:w-3/4"></div>
          <div className="mb-4 h-5 w-full rounded-md bg-gray-300"></div>
          <div className="mb-4 h-5 w-full rounded-md bg-gray-300"></div>
          <div className="h-5 w-5/6 rounded-md bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
}
