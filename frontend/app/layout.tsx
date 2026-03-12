import "./globals.css";
import Navbar from "../src/components/Navbar";

export const metadata = {
  title: "CoreNexus Legal AI",
  description: "AI Legal Document Analyzer"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>

        <Navbar />

        <div className="p-6">
          {children}
        </div>

      </body>
    </html>
  );
}