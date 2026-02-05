"use client";

import { useState } from "react";

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranslate() {
    if (!sourceText.trim()) return;

    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetLang: "de",
        }),
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`);
      }

      const data = await res.json();
      setTranslatedText(data.translation ?? data.translatedText ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Übersetzung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Übersetzer</h1>

      {/* Deutsch - Übersetzung oben */}
      <div className="mb-1">
        <span className="text-sm font-medium text-gray-700">Deutsch</span>
      </div>
      <textarea
        value={translatedText}
        readOnly
        placeholder="Übersetzung erscheint hier..."
        rows={6}
        className="w-full border border-gray-300 rounded p-3 text-sm resize-none bg-gray-50 mb-4"
      />

      {/* Quelltext - Eingabe unten */}
      <div className="mb-1">
        <span className="text-sm font-medium text-gray-700">Ausgangstext (Sprache wird automatisch erkannt)</span>
      </div>
      <textarea
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
        placeholder="Text eingeben..."
        rows={6}
        className="w-full border border-gray-300 rounded p-3 text-sm resize-none focus:outline-none focus:border-blue-400 mb-4"
      />

      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      <button
        onClick={handleTranslate}
        disabled={loading || !sourceText.trim()}
        className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Übersetze..." : "Übersetzen"}
      </button>
    </div>
  );
}
