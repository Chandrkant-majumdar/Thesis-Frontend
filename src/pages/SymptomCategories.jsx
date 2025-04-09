import React from "react";

const SymptomCategories = ({
  symptomCategories,
  categorizeSymptoms,
  remainingSymptoms,
  activeCategory,
  setActiveCategory,
}) => {
  // Calculate how many total symptoms are available
  const totalSymptoms = Object.keys(symptomCategories).reduce(
    (acc, key) => acc + categorizeSymptoms(remainingSymptoms)[key].length,
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">
          Filter symptoms by category
        </span>
        <span className="text-xs text-slate-500">{totalSymptoms} total</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.entries(symptomCategories).map(([key, label]) => {
          const categorySymptoms = categorizeSymptoms(remainingSymptoms)[key];
          if (categorySymptoms.length === 0) return null;

          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`
                px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 flex items-center
                ${
                  activeCategory === key
                    ? "bg-blue-100 border border-blue-200 text-blue-700"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
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
              <span className="ml-2 bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs">
                {categorySymptoms.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SymptomCategories;
