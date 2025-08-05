export async function hashIP(ip: string): Promise<string> {
  const crypto = await import("crypto");
  const salt = process.env.IP_SALT;
  if (!salt) {
    const message = "IP_SALT environment variable is not set";
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
  return crypto
    .createHash("sha256")
    .update(ip + (salt || "default-salt"))
    .digest("hex")
    .substring(0, 16);
}
