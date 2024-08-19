export default function LoadingSkeleton() {
  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white m-5 max-w-5xl mx-3 lg:mx-auto animate-pulse">
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
      </div>
      <h2 className="text-lg font-semibold mb-4">
        <div className="h-6 bg-gray-300 rounded w-48"></div>
      </h2>
      <div className="space-y-4">
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
      <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
    </div>
  );
}
