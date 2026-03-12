export default function AISummary({ insights = [] }) {

  return (
    <div className="bg-[#0f1424] border border-gray-800 p-8 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-white">
        AI Key Insights
      </h2>

      {insights.length === 0 ? (
        <p className="text-gray-400">
          No insights detected.
        </p>
      ) : (

        <ul className="space-y-4">

          {insights.map((item, index) => (

            <li
              key={index}
              className="flex items-start gap-3 text-gray-300 bg-black/30 p-4 rounded-lg border border-gray-800"
            >

              <span className="text-green-400 text-lg">✓</span>

              <span className="leading-relaxed">{item}</span>

            </li>

          ))}

        </ul>

      )}

    </div>
  );
}
