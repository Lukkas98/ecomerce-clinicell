"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "./button";

const SubcategoryItem = ({ subcategory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded shadow 
                 hover:bg-gray-700 transition-all hover:outline outline-2 outline-blue-800 
                 cursor-pointer"
      >
        <div>
          <p className="font-medium">{subcategory.name}</p>
          <p className="text-sm text-gray-400">
            Productos: {subcategory.products.length}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Button category={subcategory} />
          <span
            className={`transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 ml-4 bg-gray-900 rounded-lg p-3 animate-fadeIn">
          <h4 className="text-sm font-semibold mb-2 text-blue-400">
            Productos:
          </h4>
          <div className="space-y-2">
            {subcategory.products.map((product, k) => (
              <Link
                href={`/admin/panel/edit?id=${product._id}`}
                key={k}
                className="flex items-center gap-2 text-sm px-2 py-1 bg-gray-800 rounded"
              >
                <span className="text-blue-400">•</span>
                <span>{product.name}</span>
                <span className="text-gray-400 ml-auto text-xs">
                  ${product.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategoryItem;
