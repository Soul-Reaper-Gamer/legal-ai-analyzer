"use client";

export default function FairnessScore({ fairness }) {

  const score = Math.min(100, Math.max(0, fairness?.fairness_score ?? 0));
  const verdict = fairness?.verdict ?? "Not analyzed";
  const issues = fairness?.issues ?? [];

  const color =
    score > 80
      ? "text-green-400"
      : score > 60
      ? "text-yellow-400"
      : "text-red-400";

  return (

    <div className="bg-[#0f1424] border border-gray-800 p-8 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-white">
        Contract Fairness
      </h2>

      {!fairness ? (

        <p className="text-gray-400">
          Fairness analysis not available.
        </p>

      ) : (

        <>

          <div className="flex items-center gap-6 mb-6">

            <div className={`text-5xl font-bold ${color}`}>
              {score}%
            </div>

            <div className="text-gray-400">
              {verdict}
            </div>

          </div>

          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden mb-8">

            <div
              className="h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 transition-all duration-700"
              style={{ width: `${score}%` }}
            />

          </div>

          {issues.length > 0 ? (

            <div className="space-y-4">

              {issues.map((issue, i) => (

                <div
                  key={i}
                  className="bg-black/40 border border-gray-800 p-4 rounded-lg"
                >

                  <div className="text-red-400 font-semibold">
                    {issue.type}
                  </div>

                  <div className="text-gray-300 text-sm mt-1">
                    {issue.description}
                  </div>

                  <div className="text-gray-500 text-xs mt-2">
                    {issue.clause}
                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-green-400">
              No fairness issues detected.
            </p>

          )}

        </>

      )}

    </div>

  );
}
