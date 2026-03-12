export default function ContractViewer({ contractText, clauses = [] }) {

  if (!contractText) {

    return (
      <div className="bg-[#0f1424] p-6 rounded-xl text-gray-400">
        No contract text available
      </div>
    );

  }

  let highlightedText = contractText;

  clauses.forEach((clause, index) => {

    if (!clause || !clause.text) return;

    let style = "";

    if (clause.risk === "High") {
      style = "background:#ef4444;color:white;padding:3px 6px;border-radius:4px;";
    } 
    else if (clause.risk === "Medium") {
      style = "background:#facc15;color:black;padding:3px 6px;border-radius:4px;";
    } 
    else {
      style = "background:#22c55e;color:white;padding:3px 6px;border-radius:4px;";
    }

    try {

      const snippet = clause.text.split(" ").slice(0,6).join(" ");

      const escaped = snippet.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

      const regex = new RegExp(escaped, "i");

      highlightedText = highlightedText.replace(
        regex,
        '<span style="' + style + '">$&</span>'
      );

    } catch (error) {
      console.log("Highlight error:", error);
    }

  });

  return (

    <div className="bg-black border border-gray-800 p-6 rounded-xl text-sm leading-7 whitespace-pre-wrap max-h-[700px] overflow-y-auto text-gray-200">

      <div dangerouslySetInnerHTML={{ __html: highlightedText }} />

    </div>

  );

}
