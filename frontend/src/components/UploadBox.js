"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadBox() {

  const [file, setFile] = useState(null);
  const router = useRouter();

  const uploadFile = async () => {

    if (!file) {
      alert("Please select a document");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

      const res = await fetch("https://legal-ai-analyzer-j0e4.onrender.com/api/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      // Store FULL response (analysis + contract_text)
      localStorage.setItem(
        "analysis_result",
        JSON.stringify(data)
      );

      router.push("/analysis");

    } catch (error) {

      console.error(error);
      alert("Upload failed");

    }

  };

  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg w-[420px]">

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 w-full"
      />

      <button
        onClick={uploadFile}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg"
      >
        Analyze Document
      </button>

    </div>
  );
}