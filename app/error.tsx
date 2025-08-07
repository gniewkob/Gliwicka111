'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service here.
    console.error('Global error boundary caught an error', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="p-4 text-center">
          <p>Something went wrong.</p>
          <button onClick={() => reset()} className="underline">
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
