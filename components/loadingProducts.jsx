export default function LoadingProducts() {
  return (
    <>
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
    </>
  );
}
