import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadaten für die gesamte App (Titel im Browser-Tab etc.)
 */
export const metadata: Metadata = {
  title: "WM Tools",
  description: "Wohnmanufactur Tools Dashboard",
};

/**
 * Root-Layout: Umschließt alle Seiten der App.
 *
 * Enthält:
 * - Navigationsleiste oben mit Links zu den einzelnen Tools
 * - Hauptbereich (max-w-5xl zentriert) für den Seiteninhalt
 *
 * Neue Tools werden als Link in der Nav-Leiste ergänzt.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navigationsleiste */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            {/* Logo / Startseite */}
            <a href="/" className="font-bold text-lg text-blue-700">
              WM Tools
            </a>
            {/* Tool-Links - hier weitere Tools ergänzen */}
            <a
              href="/translator"
              className="text-sm text-gray-600 hover:text-blue-700"
            >
              Übersetzer
            </a>
          </div>
        </nav>
        {/* Seiteninhalt (wird durch die jeweilige page.tsx befüllt) */}
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
