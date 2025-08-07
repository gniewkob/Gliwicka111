'use client'

import { useEffect } from 'react'

export default function FormsError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error in forms route', error)
  }, [error])

  return (
    <div className="p-4 text-center">
      <p>Unable to load forms.</p>
      <button onClick={() => reset()} className="underline">
        Try again
      </button>
    </div>
  )
}
