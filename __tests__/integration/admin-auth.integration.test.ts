import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

const adminApiUrl = 'http://localhost/api/admin/metrics'
const adminPageUrl = 'http://localhost/admin/dashboard'
const healthUrl = 'http://localhost/api/health'

describe('middleware admin auth', () => {
  it('blocks unauthenticated admin API requests', async () => {
    const req = new NextRequest(adminApiUrl)
    const res = await middleware(req)
    expect(res.status).toBe(401)
  })

  it('allows authenticated admin API requests', async () => {
    const req = new NextRequest(adminApiUrl, {
      headers: { authorization: 'Bearer dev-token' },
    })
    const res = await middleware(req)
    expect(res.status).toBe(200)
  })

  it('blocks unauthenticated admin page access', async () => {
    const req = new NextRequest(adminPageUrl)
    const res = await middleware(req)
    expect(res.status).toBe(401)
  })

  it('allows authenticated admin page access', async () => {
    const req = new NextRequest(adminPageUrl, {
      headers: { authorization: 'Bearer dev-token' },
    })
    const res = await middleware(req)
    expect(res.status).toBe(200)
  })

  it('allows public health endpoint without auth', async () => {
    const req = new NextRequest(healthUrl)
    const res = await middleware(req)
    expect(res.status).toBe(200)
  })
})
