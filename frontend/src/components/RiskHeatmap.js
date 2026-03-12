export default function RiskHeatmap({ clauses = [] }) {

  const getColor = (risk) => {
    if (risk > 70) return "bg-red-500/80";
    if (risk > 40) return "bg-yellow-400/80 text-black";
    return "bg-green-500/80";
  };

  const heatmap = clauses.map((c) => ({
    clause: c.text.slice(0, 60),
    risk:
      c.risk === "High"
        ? 80
        : c.risk === "Medium"
        ? 55
        : 30
  }));

  return (

    <div className="bg-[#0f1424] border border-gray-800 p-8 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-white">
        Risk Heatmap
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {heatmap.map((item, index) => (

          <div
            key={index}
            className={`${getColor(item.risk)} p-4 rounded-xl font-medium text-sm hover:scale-105 transition`}
          >

            {item.clause}

            <div className="text-xs mt-2 opacity-80">
              Risk {item.risk}%
            </div>

          </div>

        ))}

      </div>

    </div>

  );
}
