"use client";

import { useState } from "react";

export default function ClauseCard({ clause }) {

  const [showDetails, setShowDetails] = useState(false);

  const getBadge = (risk) => {
    if (risk === "High") return "bg-red-500/20 text-red-400";
    if (risk === "Medium") return "bg-yellow-400/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  return (

    <div className="border border-gray-800 p-5 rounded-xl bg-black/40 hover:bg-black/60 transition">

      {/* CLAUSE TEXT */}

      <p className="text-gray-300 leading-relaxed">
        {clause.text}
      </p>

      {/* BADGE + BUTTON */}

      <div className="flex items-center justify-between mt-3">

        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadge(clause.risk)}`}>
          {clause.risk} Risk
        </span>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {showDetails ? "Hide Details" : "Why?"}
        </button>

      </div>

      {/* EXPLANATION */}

      {showDetails && (

        <div className="mt-4 space-y-4">

          <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300">
            <span className="font-semibold text-gray-200">
              Risk Explanation
            </span>
            <p className="mt-1">
              {clause.reason || "No explanation available."}
            </p>
          </div>

          {clause.suggestion && (

            <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-sm text-green-300">

              <span className="font-semibold text-green-400">
                Suggested Safer Clause
              </span>

              <p className="mt-1">
                {clause.suggestion}
              </p>

            </div>

          )}

        </div>

      )}

    </div>

  );
}
