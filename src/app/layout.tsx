import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WM Tools",
  description: "Wohnmanufactur Tools Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <a href="/" className="font-bold text-lg text-blue-700">
              WM Tools
            </a>
            <a
              href="/translator"
              className="text-sm text-gray-600 hover:text-blue-700"
            >
              Übersetzer
            </a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
