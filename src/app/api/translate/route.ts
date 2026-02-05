import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL nicht konfiguriert" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: body.text,
        sourceLang: body.sourceLang,
        targetLang: body.targetLang,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n Webhook Fehler: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Proxy-Fehler" },
      { status: 500 }
    );
  }
}
