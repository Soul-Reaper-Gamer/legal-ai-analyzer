"use client";

import { useState } from "react";

export default function ChatBox({ contractText }) {

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {

    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {

      const res = await fetch("https://legal-ai-analyzer-vjss.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: userMessage.text,
          contract_text: contractText
        })
      });

      const data = await res.json();

      const aiMessage = {
        role: "ai",
        text: data.answer || "No response from AI."
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error contacting AI service." }
      ]);

    } finally {

      setLoading(false);

    }

  };

  return (
    <>
      {/* Floating Chat Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center text-xl z-50"
      >
        💬
      </button>

      {/* Chat Window */}

      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[500px] bg-[#0f1424] border border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">

          {/* Header */}

          <div className="flex justify-between items-center p-4 border-b border-gray-800 flex-shrink-0">
            <h3 className="text-white font-semibold">
              AI Contract Assistant
            </h3>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm max-w-[80%] break-words ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white ml-auto"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-sm">
                AI is thinking...
              </div>
            )}

          </div>

          {/* Input */}

          <div className="p-4 border-t border-gray-800 flex gap-2 flex-shrink-0">

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") askQuestion();
              }}
              placeholder="Ask about the contract..."
              className="flex-1 p-2 rounded bg-gray-900 text-white border border-gray-700 text-sm outline-none"
            />

            <button
              onClick={askQuestion}
              className="bg-indigo-500 px-4 rounded hover:bg-indigo-600 text-sm text-white"
            >
              Ask
            </button>

          </div>

        </div>
      )}
    </>
  );
}