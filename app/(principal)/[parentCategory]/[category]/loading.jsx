const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-6">
        <div className="mb-4 flex flex-col items-center justify-center gap-5">
          <div className="h-6 w-48 rounded bg-gray-700"></div>
          <div className="h-10 w-full rounded bg-gray-700 sm:w-3/4 lg:w-1/2"></div>
        </div>
        <div className="below-320:grid-cols-1 grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg bg-gray-800 p-4 shadow-md"
            >
              <div className="mb-4 h-32 w-32 rounded-md bg-gray-700"></div>
              <div className="mb-2 h-4 w-24 rounded bg-gray-700"></div>
              <div className="h-4 w-16 rounded bg-gray-700"></div>
            </div>
          ))}
        </div>
      </section>
      <div className="mt-6 flex justify-center">
        <div className="h-10 w-48 rounded bg-gray-700"></div>
      </div>
    </div>
  );
};

export default Loading;
