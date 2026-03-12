"use client";

import Link from "next/link";

export default function Navbar() {

  return (

    <div className="bg-black/80 backdrop-blur border-b border-gray-800 text-white flex justify-between items-center px-10 py-5">

      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
        CoreNexus Legal AI
      </h1>

      <div className="space-x-6 text-gray-300">

        <Link href="/dashboard" className="hover:text-white transition">
          Analysis
        </Link>

      </div>

    </div>

  );

}
