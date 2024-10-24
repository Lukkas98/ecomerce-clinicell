"use client";
import { useState } from "react";

const ShowMoreProducts = ({ children }) => {
  const [visibleProducts, setVisibleProducts] = useState(2);

  const handleShowMore = () => {
    setVisibleProducts((prev) => prev + 2);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {children.slice(0, visibleProducts)}
      </div>

      {visibleProducts < children.length && (
        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            onClick={handleShowMore}
          >
            Ver más
          </button>
        </div>
      )}
    </>
  );
};

export default ShowMoreProducts;
