import React from "react";

const SymptomCard = ({ symptom, category, onClick, isSelected }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-xl p-4 cursor-pointer transform transition-all duration-300
      ${
        isSelected
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 hover:shadow-lg"
      }
      ${
        category === "common"
          ? "bg-gradient-to-br from-blue-50 to-blue-100"
          : category === "pain"
          ? "bg-gradient-to-br from-red-50 to-red-100"
          : category === "digestive"
          ? "bg-gradient-to-br from-green-50 to-green-100"
          : category === "respiratory"
          ? "bg-gradient-to-br from-purple-50 to-purple-100"
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      }
    `}
  >
    <div className="flex items-start gap-3">
      <div className="text-2xl">
        {category === "common"
          ? "🔵"
          : category === "pain"
          ? "🔴"
          : category === "digestive"
          ? "🫃"
          : category === "respiratory"
          ? "🫁"
          : "🏥"}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 mb-1">
          {symptom.split("_").join(" ")}
        </h3>
        <span className="text-xs text-gray-500">{category}</span>
      </div>
    </div>
    {isSelected && (
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
        <span className="text-blue-500">✓ Selected</span>
      </div>
    )}
  </div>
);

export default SymptomCard;
