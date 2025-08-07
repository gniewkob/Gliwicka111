'use client'

import { useEffect } from 'react'

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error in properties route', error)
  }, [error])

  return (
    <div className="p-4 text-center">
      <p>Unable to load properties.</p>
      <button onClick={() => reset()} className="underline">
        Try again
      </button>
    </div>
  )
}
