import { NextResponse, type NextRequest } from "next/server";
import { emailClient } from "@/lib/email/smtp-client";
import { getEnv } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const qpTo = url.searchParams.get("to") || "";
    let to = qpTo || getEnv("ADMIN_EMAIL", "");

    try {
      const body = await request.json().catch(() => null);
      if (body && typeof body.to === "string" && body.to.includes("@")) {
        to = body.to;
      }
    } catch {}

    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Missing recipient: provide ?to=email or set ADMIN_EMAIL" },
        { status: 400 },
      );
    }

    const info = await emailClient.sendEmail({
      to,
      subject: "Gliwicka 111 SMTP test",
      text: `SMTP test from Gliwicka111 at ${new Date().toISOString()}`,
    });

    return NextResponse.json(
      { ok: true, messageId: (info as any)?.messageId || null, to },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: err?.message,
          code: (err as any)?.code,
          response: (err as any)?.response,
          responseCode: (err as any)?.responseCode,
        },
      },
      { status: 500 },
    );
  }
}
