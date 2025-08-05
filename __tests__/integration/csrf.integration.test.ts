import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"
import { middleware } from "@/middleware"
import { POST } from "@/app/api/analytics/track/route"
import { db } from "@/lib/database/connection-pool"

const url = "http://localhost/api/analytics/track"
const sampleEvent = {
  formType: "test-form",
  eventType: "view",
  timestamp: Date.now(),
  sessionId: "session123",
  userAgent: "vitest",
  language: "en",
}

describe("POST /api/analytics/track CSRF protection", () => {
  it("returns 403 when CSRF token is missing", async () => {
    const req = new NextRequest(url, {
      method: "POST",
      body: JSON.stringify(sampleEvent),
      headers: {
        authorization: "Bearer dev-token",
        "content-type": "application/json",
      },
    })

    const res = await middleware(req)
    expect(res.status).toBe(403)
  })

  it("allows request with valid CSRF token", async () => {
    const token = "test-token"
    const headers = {
      authorization: "Bearer dev-token",
      "x-csrf-token": token,
      cookie: `csrf-token=${token}`,
      "content-type": "application/json",
    }

    const mwReq = new NextRequest(url, {
      method: "POST",
      body: JSON.stringify(sampleEvent),
      headers,
    })

    const mwRes = await middleware(mwReq)
    expect(mwRes.status).toBe(200)

    const routeReq = new NextRequest(url, {
      method: "POST",
      body: JSON.stringify(sampleEvent),
      headers,
    })

    const queryMock = vi.spyOn(db, "query")
    queryMock.mockResolvedValueOnce({ rows: [], rowCount: 1 }) // SELECT 1
    queryMock.mockResolvedValueOnce({ rows: [] }) // Rate limit SELECT
    queryMock.mockResolvedValueOnce({ rows: [] }) // Rate limit INSERT
    queryMock.mockResolvedValueOnce({ rows: [], rowCount: 1 }) // Analytics INSERT

    const res = await POST(routeReq)
    expect(res.status).toBe(200)
  })
})

