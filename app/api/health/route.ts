import { healthCheck } from "@/lib/monitoring/health-check";

export async function GET(request: Request) {
  return healthCheck.createHealthCheckEndpoint(request as any);
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
