import React from "react";

const SymptomCategories = ({
  symptomCategories,
  categorizeSymptoms,
  remainingSymptoms,
  activeCategory,
  setActiveCategory,
}) => (
  <div className="flex gap-2 overflow-x-auto pb-2 px-2 no-scrollbar">
    {Object.entries(symptomCategories).map(([key, label]) => {
      const categorySymptoms = categorizeSymptoms(remainingSymptoms)[key];
      if (categorySymptoms.length === 0) return null;

      return (
        <button
          key={key}
          onClick={() => setActiveCategory(key)}
          className={`
            px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200
            ${
              activeCategory === key
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          <span className="mr-2">
            {key === "common"
              ? "🔵"
              : key === "pain"
              ? "🔴"
              : key === "digestive"
              ? "🫃"
              : key === "respiratory"
              ? "🫁"
              : "🏥"}
          </span>
          {label}
          <span className="ml-2 text-xs">({categorySymptoms.length})</span>
        </button>
      );
    })}
  </div>
);

export default SymptomCategories;
