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
        className="flex cursor-pointer items-center justify-between rounded bg-gray-800 px-3 py-2 shadow outline-2 outline-blue-800 transition-all hover:bg-gray-700 hover:outline"
      >
        <div>
          <p className="font-medium">{subcategory.name}</p>
          <p className="text-sm text-gray-400">
            Productos: {subcategory.products.length}
          </p>
        </div>

        <div className="flex items-center gap-4">
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
        <div className="animate-fadeIn mt-2 ml-4 rounded-lg bg-gray-900 p-3">
          <h4 className="mb-2 text-sm font-semibold text-blue-400">
            Productos:
          </h4>
          <div className="space-y-2">
            {subcategory.products.map((product, k) => (
              <Link
                href={`/admin/panel/edit?id=${product._id}`}
                key={k}
                className="flex items-center gap-2 rounded bg-gray-800 px-2 py-1 text-sm"
              >
                <span className="text-blue-400">•</span>
                <span>{product.name}</span>
                <span className="ml-auto text-xs text-gray-400">
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
