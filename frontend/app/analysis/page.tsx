"use client";

import { useEffect, useState } from "react";

import RiskDashboard from "../../src/components/RiskDashboard";
import ClauseList from "../../src/components/ClauseList";
import RiskHeatmap from "../../src/components/RiskHeatmap";
import AISummary from "../../src/components/AISummary";
import ContractViewer from "@/src/components/ContractViewer";
import ChatBox from "@/src/components/ChatBox";
import FairnessScore from "@/src/components/FairnessScore";
import NegotiationPanel from "@/src/components/NegotiationPanel";

export default function AnalysisPage() {

  const [analysis, setAnalysis] = useState<any>(null);
  const [contractText, setContractText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    try {

      const stored = localStorage.getItem("analysis_result");

      if (stored) {

        const parsed = JSON.parse(stored);

        const analysisData = parsed.analysis || parsed;

        setAnalysis(analysisData);
        setContractText(parsed.contract_text || "");

      }

    } catch (error) {

      console.error("Error reading analysis data:", error);

    } finally {

      setLoading(false);

    }

  }, []);

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        <div className="animate-pulse">Analyzing Document...</div>
      </div>
    );

  }

  if (!analysis) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        No analysis data found. Please upload a document.
      </div>
    );

  }

const insights = analysis?.insights || [];
const riskOverview = analysis?.risk_overview || {};
const fairness = analysis?.fairness || null;
const negotiation = analysis?.negotiation || null;

  const clauses = (analysis.clauses || []).map((c) => ({
    text: c.clause_text || c.text || "",
    risk: c.risk_level || c.risk || "Low",
    type: c.clause_type || c.type || "General",
    reason: c.risk_reason || "",
    suggestion: c.suggestion || ""
  }));

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#0b0f19] via-[#090c14] to-black text-white px-6 py-14">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-14">

          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            Document Analysis
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            AI powered contract intelligence and risk detection
          </p>

        </div>

        {/* ROW 1 */}

        <div className="grid lg:grid-cols-2 gap-10">

          <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-semibold mb-5 text-gray-200">
              Risk Heatmap
            </h2>

            <RiskHeatmap clauses={clauses} />

          </div>

          <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-semibold mb-5 text-gray-200">
              Detected Clauses
            </h2>

            <ClauseList clauses={clauses} />

          </div>

        </div>

        {/* ROW 2 */}

        <div className="grid lg:grid-cols-3 gap-10 mt-12">

          <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-semibold mb-5 text-gray-200">
              Risk Overview
            </h2>

            <RiskDashboard risk={riskOverview} />

          </div>

          <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-semibold mb-5 text-gray-200">
              AI Key Insights
            </h2>

            <AISummary insights={insights} />

          </div>

          <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6">

            <FairnessScore fairness={fairness} />

          </div>

        </div>

        {/* NEGOTIATION SECTION */}

        {negotiation && (

          <div className="mt-12">

            <NegotiationPanel negotiation={negotiation} />

          </div>

        )}

        {/* ROW 3 */}

        {contractText && (

          <div className="mt-14">

            <div className="bg-[#0f1424] border border-gray-800 rounded-2xl shadow-xl p-6">

              <h2 className="text-2xl font-semibold mb-6 text-gray-200">
                Contract Viewer
              </h2>

              <ContractViewer
                contractText={contractText}
                clauses={clauses}
              />

            </div>

          </div>

        )}

      </div>

      {/* FLOATING AI CHAT */}

      <ChatBox contractText={contractText} />

    </div>

  );

}
