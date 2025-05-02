const Loading = () => {
  return (
    <div className="px-4 py-6">
      <section className="mb-6">
        <div className="flex flex-col justify-center items-center gap-5 mb-4">
          <div className="w-48 h-6 bg-gray-700 rounded"></div>
          <div className="w-full sm:w-3/4 lg:w-1/2 h-10 bg-gray-700 rounded"></div>
        </div>
        <div className="grid below-320:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow-md flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-gray-700 rounded-md mb-4"></div>
              <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
              <div className="w-16 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
      <div className="flex justify-center mt-6">
        <div className="w-48 h-10 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default Loading;
