"use client"

import { FormShowcase } from "@/components/forms"
import { ErrorBoundary } from "@/components/error-boundary"

export default function FormsPage() {
  return (
    <ErrorBoundary fallback={<p>Unable to load forms</p>}>
      <FormShowcase />
    </ErrorBoundary>
  )
}
