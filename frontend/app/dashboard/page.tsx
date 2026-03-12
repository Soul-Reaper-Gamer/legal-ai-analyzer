"use client";

import UploadBox from "../../src/components/UploadBox";

export default function Dashboard() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">

      <h1 className="text-4xl font-bold mb-4">
        AI Legal Document Analyzer
      </h1>

      <p className="text-gray-400 mb-10 text-center max-w-lg">
        Upload any legal contract and instantly understand
        hidden risks, clauses, obligations and legal insights
        powered by AI.
      </p>

      <UploadBox />

    </div>
  );
}