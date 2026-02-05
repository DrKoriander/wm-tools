import { NextRequest, NextResponse } from "next/server";

/**
 * API-Route: POST /api/prepare
 *
 * Serverless Proxy zwischen Frontend und n8n Workflow "Prepare for Translation".
 * Das Frontend sendet eine Datensatz-Referenz (recordId + table),
 * n8n holt sich die Daten direkt aus Business Express, bereinigt den
 * HTML-Inhalt und gibt den Klartext zurück.
 *
 * Ablauf:
 *   1. Frontend sendet POST mit { recordId, table }
 *   2. Diese Route leitet an den n8n Webhook "prepare-for-translation" weiter
 *   3. n8n authentifiziert sich bei BE, ruft API\ReadMemo.dwp auf
 *   4. n8n strippt HTML und gibt { text, subject, status } zurück
 *   5. Die Antwort wird ans Frontend durchgereicht
 */
export async function POST(req: NextRequest) {
  // Webhook-URL aus Vercel Environment Variable (serverseitig, nicht im Browser sichtbar)
  const webhookUrl = process.env.N8N_PREPARE_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_PREPARE_WEBHOOK_URL nicht konfiguriert" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Pflichtfeld prüfen
    if (!body.recordId) {
      return NextResponse.json(
        { error: "recordId ist erforderlich" },
        { status: 400 }
      );
    }

    // Anfrage an den n8n Webhook weiterleiten
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recordId: body.recordId,
        table: body.table || "dab065",  // Standard: Memo-Tabelle
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n Webhook Fehler: ${response.status}` },
        { status: 502 }  // 502 Bad Gateway = Upstream-Fehler (n8n)
      );
    }

    // n8n-Antwort (bereinigter Text) ans Frontend durchreichen
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Proxy-Fehler" },
      { status: 500 }
    );
  }
}
