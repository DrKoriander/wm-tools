import { NextRequest, NextResponse } from "next/server";

/**
 * API-Route: POST /api/translate
 *
 * Serverless Proxy zwischen Frontend und n8n Webhook.
 * Die Webhook-URL ist nur serverseitig in der Environment Variable
 * N8N_WEBHOOK_URL gespeichert und damit im Browser nicht sichtbar.
 *
 * Ablauf:
 *   1. Frontend sendet POST mit { text, targetLang }
 *   2. Diese Route leitet die Anfrage an den n8n Webhook weiter
 *   3. n8n ruft DeepL auf und gibt { translation, sourceLanguage, status } zurück
 *   4. Die Antwort wird ans Frontend durchgereicht
 */
export async function POST(req: NextRequest) {
  // Webhook-URL aus Vercel Environment Variable lesen (serverseitig, nicht im Browser sichtbar)
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL nicht konfiguriert" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Anfrage an den n8n Webhook weiterleiten
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: body.text,
        sourceLang: body.sourceLang,   // Optional: DeepL erkennt die Sprache automatisch
        targetLang: body.targetLang,   // Zielsprache, z.B. "de"
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n Webhook Fehler: ${response.status}` },
        { status: 502 } // 502 Bad Gateway = Upstream-Fehler (n8n)
      );
    }

    // n8n-Antwort direkt ans Frontend durchreichen
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Proxy-Fehler" },
      { status: 500 }
    );
  }
}
