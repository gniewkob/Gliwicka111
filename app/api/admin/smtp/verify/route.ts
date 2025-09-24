import { NextResponse, type NextRequest } from "next/server";
import { buildTransportOptions, createTransporter } from "@/lib/email/smtp-client";
import { getEnv } from "@/lib/env";

function mask(v?: string) {
  if (!v) return "";
  if (v.length <= 4) return "***";
  return v.slice(0, 2) + "***" + v.slice(-2);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const insecureTLS = ["1", "true", "yes"].includes(
      (searchParams.get("insecureTLS") || "").toLowerCase(),
    );
    const debug = ["1", "true", "yes"].includes(
      (searchParams.get("debug") || "").toLowerCase(),
    );

    const opts = buildTransportOptions({ insecureTLS, debug });
    const { transporter } = createTransporter({ insecureTLS, debug });

    let ok = false;
    let error: any = undefined;
    const started = Date.now();
    try {
      ok = await transporter.verify();
    } catch (e: any) {
      ok = false;
      error = {
        name: e?.name,
        message: e?.message,
        code: e?.code,
        command: e?.command,
        response: e?.response,
        responseCode: e?.responseCode,
      };
    }
    const durationMs = Date.now() - started;

    const host = (opts as any).host as string | undefined;
    const port = (opts as any).port as number | undefined;
    const secure = (opts as any).secure as boolean | undefined;
    const authUser = (opts as any).auth?.user as string | undefined;

    return NextResponse.json(
      {
        ok,
        durationMs,
        config: {
          host,
          port,
          secure,
          userMasked: mask(authUser),
          from: getEnv("SMTP_FROM", ""),
          debugEnabled: Boolean((opts as any).debug),
          insecureTLS: insecureTLS,
        },
        error,
      },
      { status: ok ? 200 : 500 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: { message: err?.message || "Unknown error" } },
      { status: 500 },
    );
  }
}
