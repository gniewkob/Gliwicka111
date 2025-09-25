import { type NextRequest } from "next/server";

import { healthCheck } from "@/lib/monitoring/health-check";

export async function GET(request: Request) {
  const nextE2E = process.env.NEXT_PUBLIC_E2E === "true";
  const skipOptionalChecks = nextE2E ||
    process.env.HEALTHCHECK_SKIP_OPTIONAL === "true" ||
    process.env.NODE_ENV === "test";

  return healthCheck.createHealthCheckEndpoint(request as NextRequest, {
    skipOptionalChecks,
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
