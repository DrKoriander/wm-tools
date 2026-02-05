"use client";

import { useState, useEffect } from "react";

/**
 * Übersetzer-Seite (/translator)
 *
 * Übersetzt beliebigen Text nach Deutsch via DeepL (über n8n Webhook).
 * Die Quellsprache wird automatisch von DeepL erkannt.
 *
 * Ablauf (manuell):
 *   1. User gibt Text im unteren Feld ein
 *   2. Klick auf "Übersetzen" sendet POST an /api/translate (Serverless Proxy)
 *   3. Der Proxy leitet den Text an den n8n Webhook weiter
 *   4. Die deutsche Übersetzung erscheint im oberen Feld
 *
 * Ablauf (aus Business Express):
 *   1. BE öffnet URL mit Parametern: /translator?recordId=123&table=dab065
 *   2. Die Seite erkennt die URL-Parameter und ruft /api/prepare auf
 *   3. n8n holt die Daten aus BE (Memo-Feld), strippt HTML
 *   4. Der bereinigte Text erscheint automatisch im Quelltext-Feld
 *   5. User klickt manuell "Übersetzen"
 */
export default function TranslatorPage() {
  // Eingabetext des Users (beliebige Sprache)
  const [sourceText, setSourceText] = useState("");
  // Übersetzungsergebnis (Deutsch)
  const [translatedText, setTranslatedText] = useState("");
  // Ladezustand während der API-Anfrage
  const [loading, setLoading] = useState(false);
  // Fehlermeldung bei fehlgeschlagener Übersetzung
  const [error, setError] = useState("");
  // Ladezustand für die Datenaufbereitung aus BE
  const [preparing, setPreparing] = useState(false);

  /**
   * Beim Laden der Seite: URL-Parameter prüfen.
   * Wenn recordId und table vorhanden sind, werden die Daten
   * automatisch aus Business Express geladen und aufbereitet.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recordId = params.get("recordId");
    const table = params.get("table");

    if (recordId) {
      loadPreparedText(recordId, table || "dab065");
    }
  }, []);

  /**
   * Lädt aufbereiteten Text aus Business Express über n8n.
   * Die API-Route /api/prepare leitet die Anfrage an n8n weiter,
   * n8n holt die Daten direkt aus BE und strippt HTML.
   */
  async function loadPreparedText(recordId: string, table: string) {
    setPreparing(true);
    setError("");

    try {
      const res = await fetch("/api/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, table }),
      });

      if (!res.ok) {
        throw new Error(`Daten konnten nicht geladen werden: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "error") {
        throw new Error(data.message || "Fehler beim Laden der Daten");
      }

      // Bereinigten Text in das Quelltext-Feld setzen
      setSourceText(data.text || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Daten konnten nicht geladen werden");
    } finally {
      setPreparing(false);
    }
  }

  /**
   * Sendet den Quelltext an die API-Route /api/translate.
   * Die API-Route leitet den Text als Proxy an den n8n Webhook weiter,
   * damit die Webhook-URL nicht im Browser sichtbar ist.
   */
  async function handleTranslate() {
    // Leere Eingabe ignorieren
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
          targetLang: "de", // Immer nach Deutsch übersetzen
        }),
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`);
      }

      // n8n gibt { translation: "..." } zurück
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

      {/* Ladeanzeige: Wird angezeigt während Daten aus BE geladen werden */}
      {preparing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          Daten werden aus Business Express geladen...
        </div>
      )}

      {/* Ausgabefeld: Deutsche Übersetzung (oben, nur lesbar) */}
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

      {/* Eingabefeld: Quelltext in beliebiger Sprache (unten) */}
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

      {/* Fehlermeldung (nur sichtbar wenn ein Fehler aufgetreten ist) */}
      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      {/* Übersetzen-Button: deaktiviert während Ladevorgang oder bei leerem Text */}
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
