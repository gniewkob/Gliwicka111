export function sanitizePhone(raw: string): string {
  if (!raw) return "";
  // Keep leading + and digits, drop other characters
  let v = raw.replace(/[^+\d]/g, "");
  // Collapse multiple + into single at start
  v = v.replace(/\+(?=\+)/g, "");
  // Convert leading 00 to +
  v = v.replace(/^00/, "+");
  // If + appears not at start, remove it
  if (v.length > 0 && v[0] !== "+") v = v.replace(/\+/g, "");
  return v;
}

export function toE164(raw: string, lang: "pl" | "en" = "pl"): string {
  let v = sanitizePhone(raw);
  if (v.startsWith("+")) return v;
  // If no country code provided, apply a sensible default for PL when 9 digits
  const digits = v.replace(/\D/g, "");
  if (lang === "pl" && digits.length === 9) return `+48${digits}`;
  // Otherwise return digits as-is (no +)
  return digits;
}

export function maskPhoneInput(raw: string): string {
  // Allow user to type + and digits; strip other characters on the fly
  return sanitizePhone(raw);
}
