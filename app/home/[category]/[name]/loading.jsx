export default function Loading() {
  return (
    <section className="mx-auto p-4 lg:w-full animate-pulse">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <div className="w-full max-w-[450px]">
          <div className="bg-gray-300 h-80 md:h-96 w-full rounded-md"></div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <div className="h-8 bg-gray-300 rounded-md mb-4 w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded-md mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded-md mb-6 w-1/4"></div>
          <div className="h-12 bg-gray-300 rounded-md mb-6 w-full md:w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded-md w-full mb-4"></div>
          <div className="h-5 bg-gray-300 rounded-md w-full mb-4"></div>
          <div className="h-5 bg-gray-300 rounded-md w-5/6"></div>
        </div>
      </div>
    </section>
  );
}
