"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MetricsResponse {
  windowHours: number;
  submissions: {
    averageProcessingTime: number;
    peakProcessingTime: number;
    averageEmailLatency: number;
    peakEmailLatency: number;
    errorRate: number;
  };
  failedEmails: {
    averageRetryCount: number;
    peakRetryCount: number;
    retryRate: number;
  };
  rateLimits: {
    averageCount: number;
    peakCount: number;
  };
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const user = process.env.NEXT_PUBLIC_ADMIN_USER;
        const pass = process.env.NEXT_PUBLIC_ADMIN_PASS;

        const headers: HeadersInit = {};
        if (user && pass) {
          const auth = btoa(`${user}:${pass}`);
          headers.Authorization = `Basic ${auth}`;
        }

        const res = await fetch("/api/admin/metrics", { headers });

        if (!res.ok) {
          setError(`Request failed: ${res.status}`);
          return;
        }

        const data: MetricsResponse = await res.json();
        setMetrics(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    loadMetrics();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!metrics) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Metrics</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Avg Processing Time</TableCell>
            <TableCell>
              {metrics.submissions.averageProcessingTime.toFixed(2)} ms
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Peak Processing Time</TableCell>
            <TableCell>{metrics.submissions.peakProcessingTime} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Avg Email Latency</TableCell>
            <TableCell>
              {metrics.submissions.averageEmailLatency.toFixed(2)} ms
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Peak Email Latency</TableCell>
            <TableCell>{metrics.submissions.peakEmailLatency} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Error Rate</TableCell>
            <TableCell>
              {(metrics.submissions.errorRate * 100).toFixed(2)}%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Avg Retry Count</TableCell>
            <TableCell>
              {metrics.failedEmails.averageRetryCount.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Peak Retry Count</TableCell>
            <TableCell>{metrics.failedEmails.peakRetryCount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Retry Rate</TableCell>
            <TableCell>
              {(metrics.failedEmails.retryRate * 100).toFixed(2)}%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Avg Rate Limit Count</TableCell>
            <TableCell>{metrics.rateLimits.averageCount.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Peak Rate Limit Count</TableCell>
            <TableCell>{metrics.rateLimits.peakCount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
