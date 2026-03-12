"use client";

export default function RiskDashboard({ risk = {} }) {

  const risks = [
    { name: "Financial Risk", value: risk.financial_risk || 0 },
    { name: "Liability Risk", value: risk.liability_risk || 0 },
    { name: "Termination Risk", value: risk.termination_risk || 0 },
    { name: "Privacy Risk", value: risk.privacy_risk || 0 }
  ];

  return (

    <div className="bg-[#0f1424] border border-gray-800 p-8 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-white">
        Risk Overview
      </h2>

      {risks.map((risk, index) => (

        <div key={index} className="mb-6">

          <div className="flex justify-between mb-2 text-sm text-gray-300">
            <span>{risk.name}</span>
            <span>{risk.value}%</span>
          </div>

          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">

            <div
              className="h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700"
              style={{ width: `${risk.value}%` }}
            />

          </div>

        </div>

      ))}

    </div>

  );
}
