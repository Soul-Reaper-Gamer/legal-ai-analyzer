"use client";

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO SECTION */}

      <div className="flex flex-col items-center justify-center text-center py-40 px-6">

        <h1 className="text-5xl font-bold mb-6">
          AI Legal Document Analyzer
        </h1>

        <p className="text-gray-400 max-w-2xl mb-10 text-lg">
          Understand legal contracts instantly. Detect hidden risks,
          dangerous clauses and obligations using Artificial Intelligence.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg"
        >
          Analyze Your Document
        </button>

      </div>

      {/* FEATURES */}

      <div className="grid md:grid-cols-3 gap-10 px-12 pb-32">

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3">
            Risk Detection
          </h3>

          <p className="text-gray-400">
            Automatically detect risky clauses like penalties,
            termination traps and liability issues.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3">
            AI Clause Explanation
          </h3>

          <p className="text-gray-400">
            Complex legal language simplified into clear
            explanations anyone can understand.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3">
            Risk Heatmap
          </h3>

          <p className="text-gray-400">
            Visual heatmap highlights dangerous parts
            of contracts instantly.
          </p>
        </div>

      </div>

    </div>
  );
}