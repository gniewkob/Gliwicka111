"use client"

export function isE2E(): boolean {
  const byEnv = process.env.NEXT_PUBLIC_E2E === 'true'
  if (typeof window === 'undefined') return byEnv
  const byBody = typeof document !== 'undefined' && document?.body?.dataset?.e2e === 'true'
  const byParam = new URLSearchParams(window.location.search).has('e2e')
  return byEnv || byBody || byParam
}

