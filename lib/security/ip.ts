import { getEnv, isProd } from "@/lib/env";

export async function hashIP(ip: string): Promise<string> {
  const crypto = await import("crypto");
  let salt: string;
  try {
    salt = getEnv("IP_SALT");
  } catch {
    const message = "IP_SALT environment variable is not set";
    if (isProd) {
      throw new Error(message);
    } else {
      console.warn(message);
      salt = "default-salt";
    }
  }
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .substring(0, 16);
}
