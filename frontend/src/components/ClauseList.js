"use client";

import ClauseCard from "./ClauseCard";

export default function ClauseList({ clauses }) {

  return (

    <div className="bg-[#0f1424] border border-gray-800 rounded-2xl p-8 shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-white">
        Detected Clauses
      </h2>

      {clauses.length === 0 ? (

        <p className="text-gray-400">
          No clauses detected.
        </p>

      ) : (

        <div className="space-y-5">

          {clauses.map((clause, index) => (

            <ClauseCard
              key={index}
              clause={clause}
            />

          ))}

        </div>

      )}

    </div>

  );
}
