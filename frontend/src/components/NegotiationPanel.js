"use client";

export default function NegotiationPanel({ negotiation }) {

  if (!negotiation) return null;

  return (

    <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6 mt-12">

      <h2 className="text-xl font-semibold mb-6 text-gray-200">
        Negotiation Insights
      </h2>

      {/* Strength Score */}

      <div className="mb-8">

        <h3 className="text-lg text-indigo-400 mb-2">
          Negotiation Strength
        </h3>

        <p className="text-3xl font-bold text-white">
          {negotiation.strength_score}%
        </p>

      </div>

      {/* Strategy */}

      <div className="mb-8">

        <h3 className="text-lg text-yellow-400 mb-3">
          Negotiation Strategy
        </h3>

        <div className="text-sm text-gray-300">

          <p className="text-red-400 mb-2">High Priority</p>

          {negotiation.strategy.high_priority.map((c, i) => (
            <p key={i}>⚠ {c}</p>
          ))}

          <p className="text-yellow-400 mt-4 mb-2">
            Medium Priority
          </p>

          {negotiation.strategy.medium_priority.map((c, i) => (
            <p key={i}>• {c}</p>
          ))}

          <p className="text-green-400 mt-4 mb-2">
            Low Priority
          </p>

          {negotiation.strategy.low_priority.map((c, i) => (
            <p key={i}>✓ {c}</p>
          ))}

        </div>

      </div>

      {/* Suggestions */}

      <div>

        <h3 className="text-lg text-green-400 mb-3">
          Negotiation Suggestions
        </h3>

        {negotiation.suggestions.map((s, i) => (

          <div
            key={i}
            className="bg-[#0b0f19] border border-gray-700 p-4 rounded-lg mb-4"
          >

            <p className="text-gray-300 mb-2">
              {s.clause}
            </p>

            <p className="text-yellow-400 text-sm">
              Tip: {s.negotiation_tip}
            </p>

            <p className="text-green-400 text-sm mt-1">
              Alternative: {s.alternative_clause}
            </p>

            <p className="text-indigo-400 text-sm mt-1">
              Negotiation Strength: {s.strength}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}
