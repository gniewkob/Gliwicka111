"use client"

import { FormShowcase } from "@/components/forms"
import { ErrorBoundary } from "@/components/error-boundary"
import { isE2E } from "@/lib/is-e2e"

export default function FormsPage() {
  const e2e = isE2E()
  if (e2e) return <FormShowcase />
  return (
    <ErrorBoundary fallback={<p>Unable to load forms</p>}>
      <FormShowcase />
    </ErrorBoundary>
  )
}
