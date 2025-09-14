import { NextResponse } from "next/server";
import { meetingRoomFormSchema } from "@/lib/validation-schemas";
import { messages } from "@/lib/i18n";

function formDataToObject(fd: FormData): Record<string, any> {
  const obj: Record<string, any> = {};
  for (const [key, value] of fd.entries()) {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        (obj[key] as any[]).push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const data = formDataToObject(fd);

    const processed: Record<string, any> = {
      ...data,
      gdprConsent: ["on", "true", "1"].includes(String(data.gdprConsent)),
      marketingConsent: ["on", "true", "1"].includes(
        String(data.marketingConsent),
      ),
      catering: ["on", "true", "1"].includes(String(data.catering)),
      recurring: ["on", "true", "1"].includes(String(data.recurring)),
      equipment: ([] as string[]).concat(
        Array.isArray(data.equipment)
          ? data.equipment
          : data.equipment
            ? [data.equipment]
            : [],
      ),
      attendees:
        data.attendees !== undefined && !Number.isNaN(Number(data.attendees))
          ? Number(data.attendees)
          : data.attendees,
    };

    const parsed = meetingRoomFormSchema.safeParse(processed);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const err of parsed.error.errors) {
        errors[err.path.join(".")] = err.message;
      }
      const lang: "pl" | "en" = "pl";
      return NextResponse.json(
        {
          success: false,
          message: messages.form.validationError[lang],
          errors,
        },
        { status: 400 },
      );
    }

    const lang: "pl" | "en" = "pl";
    return NextResponse.json(
      { success: true, message: messages.form.success[lang] },
      { status: 200 },
    );
  } catch (e) {
    const lang: "pl" | "en" = "pl";
    return NextResponse.json(
      { success: false, message: messages.form.serverError[lang] },
      { status: 500 },
    );
  }
}
