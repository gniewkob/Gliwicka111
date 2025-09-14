import { type NextRequest, NextResponse } from "next/server";
import type { Pool } from "pg";

interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  responseTime: number;
  message?: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  uptime: number;
  timestamp: string;
  checks: HealthCheckResult[];
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

export class HealthCheckService {
  private static instance: HealthCheckService;
  private startTime: number = Date.now();
  private version: string = process.env.npm_package_version || "1.0.0";

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkEmailService(),
      this.checkFileSystem(),
      this.checkMemoryUsage(),
      this.checkExternalDependencies(),
      this.checkFormSubmissionEndpoint(),
      this.checkAnalyticsService(),
    ]);

    const healthResults: HealthCheckResult[] = checks.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return {
          service: `unknown-${index}`,
          status: "unhealthy" as const,
          responseTime: 0,
          message: result.reason?.message || "Unknown error",
          timestamp: new Date().toISOString(),
        };
      }
    });

    const summary = this.calculateSummary(healthResults);
    const overallStatus = this.determineOverallStatus(summary);

    return {
      status: overallStatus,
      version: this.version,
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString(),
      checks: healthResults,
      summary,
    };
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      const { getPool } = await import("@/lib/database/connection-pool");
      const db = (await getPool()) as Pool;
      await db.query("SELECT 1");

      return {
        service: "database",
        status: "healthy",
        responseTime: performance.now() - startTime,
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "database",
        status: "unhealthy",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkEmailService(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      const { emailClient } = await import("@/lib/email/smtp-client");

      const isHealthy = await emailClient.verifyConnection();
      if (!isHealthy) {
        throw new Error("SMTP connection verification failed");
      }

      return {
        service: "email",
        status: "healthy",
        responseTime: performance.now() - startTime,
        message: "Email service connection successful",
        details: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "email",
        status: "unhealthy",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkFileSystem(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      // Check if we can write to temp directory
      const fs = await import("fs/promises");
      const path = await import("path");

      const tempFile = path.join(process.cwd(), "tmp", "health-check.txt");
      await fs.writeFile(tempFile, "health check", "utf8");
      await fs.unlink(tempFile);

      return {
        service: "filesystem",
        status: "healthy",
        responseTime: performance.now() - startTime,
        message: "File system read/write operations successful",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "filesystem",
        status: "unhealthy",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkMemoryUsage(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      const memoryUsage = process.memoryUsage();
      const usagePercentage =
        (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      let status: HealthCheckResult["status"] = "healthy";
      let message = `Memory usage: ${usagePercentage.toFixed(2)}%`;

      if (usagePercentage > 90) {
        status = "unhealthy";
        message += " - Critical memory usage";
      } else if (usagePercentage > 75) {
        status = "degraded";
        message += " - High memory usage";
      }

      return {
        service: "memory",
        status,
        responseTime: performance.now() - startTime,
        message,
        details: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss,
          usagePercentage: Number.parseFloat(usagePercentage.toFixed(2)),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "memory",
        status: "unhealthy",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkExternalDependencies(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      // Check external services (CDNs, APIs, etc.)
      const dependencies = [
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
      ];

      const checks = await Promise.allSettled(
        dependencies.map(async (url) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          try {
            const response = await fetch(url, {
              method: "HEAD",
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return { url, status: response.status, ok: response.ok };
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        }),
      );

      const failedChecks = checks.filter(
        (check) => check.status === "rejected",
      );
      const status =
        failedChecks.length === 0
          ? "healthy"
          : failedChecks.length < checks.length
            ? "degraded"
            : "unhealthy";

      return {
        service: "external-dependencies",
        status,
        responseTime: performance.now() - startTime,
        message: `${checks.length - failedChecks.length}/${checks.length} external dependencies available`,
        details: {
          total: checks.length,
          available: checks.length - failedChecks.length,
          failed: failedChecks.length,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "external-dependencies",
        status: "degraded",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkFormSubmissionEndpoint(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const endpoints = [
      "/api/forms/virtual-office",
      "/api/forms/coworking",
      "/api/forms/meeting-room",
      "/api/forms/advertising",
      "/api/forms/special-deals",
    ];
    const TIMEOUT_MS = 5000;

    try {
      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

          try {
            const res = await fetch(`${baseUrl}${endpoint}`, {
              method: "GET",
              signal: controller.signal,
            });
            return res.ok || res.status === 405;
          } catch {
            return false;
          } finally {
            clearTimeout(timeout);
          }
        }),
      );

      const allHealthy = results.every(Boolean);

      return {
        service: "form-submission",
        status: allHealthy ? "healthy" : "unhealthy",
        responseTime: performance.now() - startTime,
        message: allHealthy
          ? "Form submission endpoints operational"
          : "One or more form endpoints are unavailable",
        details: { endpoints },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "form-submission",
        status: "unhealthy",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkAnalyticsService(): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      // Check analytics service functionality
      const { analyticsClient } = await import("@/lib/analytics-client");

      // Test analytics client
      const sessionId = analyticsClient.getSessionId();
      const hasConsent = analyticsClient.hasConsent();

      return {
        service: "analytics",
        status: "healthy",
        responseTime: performance.now() - startTime,
        message: "Analytics service operational",
        details: {
          sessionId: sessionId ? "present" : "missing",
          consentStatus: hasConsent ? "granted" : "not-granted",
          clientInitialized: true,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: "analytics",
        status: "degraded",
        responseTime: performance.now() - startTime,
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private calculateSummary(checks: HealthCheckResult[]) {
    return {
      total: checks.length,
      healthy: checks.filter((c) => c.status === "healthy").length,
      degraded: checks.filter((c) => c.status === "degraded").length,
      unhealthy: checks.filter((c) => c.status === "unhealthy").length,
    };
  }

  private determineOverallStatus(
    summary: ReturnType<typeof this.calculateSummary>,
  ): SystemHealth["status"] {
    if (summary.unhealthy > 0) return "unhealthy";
    if (summary.degraded > 0) return "degraded";
    return "healthy";
  }

  async createHealthCheckEndpoint(request: NextRequest): Promise<NextResponse> {
    try {
      const health = await this.performHealthCheck();

      const statusCode =
        health.status === "healthy"
          ? 200
          : health.status === "degraded"
            ? 200
            : 503;

      return NextResponse.json(health, {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Health check failed",
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      );
    }
  }
}

export const healthCheck = HealthCheckService.getInstance();
