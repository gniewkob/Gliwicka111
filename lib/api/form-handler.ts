import { NextResponse } from "next/server";
import type { z } from "zod";
import { messages } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/get-current-language";
import { handleFormSubmission } from "@/lib/server-actions";

async function detectLanguage(headers: Headers): Promise<"pl" | "en"> {
  try {
    return await getCurrentLanguage();
  } catch {
    const header = headers.get("accept-language")?.toLowerCase() || "";
    return header.startsWith("en") ? "en" : "pl";
  }
}

export async function processFormRequest<T>(
  req: Request,
  schema: z.ZodSchema<T>,
  formType: string,
) {
  const fd = await req.formData();
  // Convert FormData to object as a reusable step
  const data = Object.fromEntries(fd.entries());
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v as any));
    } else {
      formData.append(key, value as any);
    }
  }

  try {
    const result = await handleFormSubmission(
      formData,
      schema,
      formType,
      req.headers,
    );
    const status = result.status ?? (result.success ? 200 : 400);
    return NextResponse.json(result, { status });
  } catch {
    const lang = await detectLanguage(req.headers);
    return NextResponse.json(
      { success: false, message: messages.form.serverError[lang] },
      { status: 500 },
    );
  }
}
