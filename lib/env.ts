export const isProd = process.env.NODE_ENV === 'production'
export const isCI = process.env.CI === 'true'

export function getEnv(name: string, fallback?: string): string {
  const val = process.env[name]
  if (val === undefined || val === '') {
    if (fallback !== undefined) return fallback
    throw new Error(`Missing required env: ${name}`)
  }
  return val
}

