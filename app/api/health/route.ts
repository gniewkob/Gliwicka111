import { type NextRequest } from "next/server";

import { healthCheck } from "@/lib/monitoring/health-check";

export async function GET(request: Request) {
  const isProd = process.env.NODE_ENV === "production";
  const skipOptionalChecks = !isProd && (
    process.env.HEALTHCHECK_SKIP_OPTIONAL === "true" ||
    process.env.NEXT_PUBLIC_E2E === "true" ||
    process.env.NODE_ENV === "test"
  );


  return healthCheck.createHealthCheckEndpoint(request as NextRequest, {
    skipOptionalChecks,
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
