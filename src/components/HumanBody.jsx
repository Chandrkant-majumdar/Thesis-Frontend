import React, { useState } from "react";

// Body regions with their corresponding symptoms
const bodyRegions = {
  head: {
    name: "Head",
    symptoms: ["headache", "dizziness", "confusion", "blurred_vision"],
    path: "M100,50 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0",
  },
  chest: {
    name: "Chest & Lungs",
    symptoms: ["chest_pain", "shortness_of_breath", "cough", "wheezing"],
    path: "M90,150 h100 v70 h-100 z",
  },
  abdomen: {
    name: "Abdomen",
    symptoms: [
      "abdominal_pain",
      "nausea",
      "vomiting",
      "bloating",
      "diarrhea",
      "constipation",
    ],
    path: "M90,220 h100 v60 h-100 z",
  },
  extremities: {
    name: "Extremities",
    symptoms: ["joint_pain", "muscle_pain", "weakness", "numbness", "swelling"],
    path: "M90,280 h40 v120 h-40 z M150,280 h40 v120 h-40 z M50,150 h40 v100 h-40 z M190,150 h40 v100 h-40 z",
  },
  skin: {
    name: "Skin",
    symptoms: ["rash", "itching", "hives", "bruising"],
    path: "", // No specific path - will be handled specially
  },
};

export const HumanBody = ({ selectedRegion, onSelectRegion }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Function to get the CSS class for each region
  const getRegionClass = (region) => {
    if (region === selectedRegion) {
      return "fill-blue-400 opacity-50 cursor-pointer";
    }
    if (region === hoveredRegion) {
      return "fill-blue-300 opacity-40 cursor-pointer";
    }
    return "fill-blue-200 opacity-30 hover:opacity-40 hover:fill-blue-300 cursor-pointer";
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Human body SVG */}
      <svg viewBox="0 0 280 400" className="max-w-[300px] max-h-[400px]">
        {/* Body silhouette */}
        <g className="stroke-white stroke-1">
          {/* Head */}
          <path
            d={bodyRegions.head.path}
            onClick={() => onSelectRegion("head")}
            onMouseEnter={() => setHoveredRegion("head")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("head")}
          />

          {/* Torso */}
          <rect
            x="90"
            y="90"
            width="100"
            height="60"
            className="fill-blue-200 opacity-20"
          />

          {/* Chest */}
          <rect
            x="90"
            y="150"
            width="100"
            height="70"
            onClick={() => onSelectRegion("chest")}
            onMouseEnter={() => setHoveredRegion("chest")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("chest")}
          />

          {/* Abdomen */}
          <rect
            x="90"
            y="220"
            width="100"
            height="60"
            onClick={() => onSelectRegion("abdomen")}
            onMouseEnter={() => setHoveredRegion("abdomen")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("abdomen")}
          />

          {/* Legs */}
          <rect
            x="90"
            y="280"
            width="40"
            height="120"
            onClick={() => onSelectRegion("extremities")}
            onMouseEnter={() => setHoveredRegion("extremities")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("extremities")}
          />
          <rect
            x="150"
            y="280"
            width="40"
            height="120"
            onClick={() => onSelectRegion("extremities")}
            onMouseEnter={() => setHoveredRegion("extremities")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("extremities")}
          />

          {/* Arms */}
          <rect
            x="50"
            y="150"
            width="40"
            height="100"
            onClick={() => onSelectRegion("extremities")}
            onMouseEnter={() => setHoveredRegion("extremities")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("extremities")}
          />
          <rect
            x="190"
            y="150"
            width="40"
            height="100"
            onClick={() => onSelectRegion("extremities")}
            onMouseEnter={() => setHoveredRegion("extremities")}
            onMouseLeave={() => setHoveredRegion(null)}
            className={getRegionClass("extremities")}
          />

          {/* Outline */}
          <path
            d="M100,50 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0 M140,90 v0 M90,90 h100 v190 h-40 v120 h-20 v-120 h-40 z M90,150 h-40 v100 h40 M190,150 h40 v100 h-40"
            fill="none"
            className="stroke-blue-100"
          />
        </g>

        {/* Labels */}
        {Object.entries(bodyRegions).map(([key, region]) => {
          // Skip skin as it doesn't have a specific position
          if (key === "skin") return null;

          // Determine label position
          let x, y;
          switch (key) {
            case "head":
              x = 140;
              y = 50;
              break;
            case "chest":
              x = 140;
              y = 185;
              break;
            case "abdomen":
              x = 140;
              y = 250;
              break;
            case "extremities":
              x = 140;
              y = 340;
              break;
            default:
              x = 0;
              y = 0;
          }

          // Only show label if region is selected or hovered
          if (key !== selectedRegion && key !== hoveredRegion) return null;

          return (
            <g key={key} className="pointer-events-none">
              <circle cx={x} cy={y} r="18" className="fill-blue-500/40" />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-xs font-semibold"
              >
                {key.charAt(0).toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Skin option (floating button at the bottom) */}
      <button
        onClick={() => onSelectRegion("skin")}
        className={`absolute bottom-2 left-0 right-0 mx-auto w-24 py-2 px-3 rounded-full backdrop-blur-md border transition-all 
          ${
            selectedRegion === "skin"
              ? "bg-blue-400/50 border-blue-400/70 text-white font-medium"
              : "bg-white/10 border-white/30 text-blue-100 hover:bg-blue-400/30"
          }`}
      >
        Skin
      </button>

      {/* Region hover label */}
      {hoveredRegion && (
        <div className="absolute top-4 left-0 right-0 mx-auto text-center">
          <span className="inline-block backdrop-blur-md bg-white/20 text-white px-3 py-1 rounded-full text-sm border border-white/20">
            {bodyRegions[hoveredRegion].name}
          </span>
        </div>
      )}
    </div>
  );
};

// Helper functions to use in the main component
export const getRegionName = (region) => {
  return bodyRegions[region]?.name || region;
};

export const getRegionSymptoms = (region) => {
  return bodyRegions[region]?.symptoms || [];
};
