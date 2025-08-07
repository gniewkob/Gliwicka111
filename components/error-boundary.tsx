'use client'

import React from 'react'

/**
 * Reusable React error boundary component.
 *
 * Recovery: renders a fallback UI and allows users to retry by resetting the
 * internal error state.
 * Logging: errors are logged to the console and can be forwarded to external
 * monitoring services.
 */
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ReactNode }>,
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Replace console.error with integration to a logging service like Sentry.
    console.error('ErrorBoundary caught an error', error, info)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center" role="alert">
          {this.props.fallback ?? (
            <div className="space-y-2">
              <p>Something went wrong.</p>
              <button
                type="button"
                onClick={this.handleReset}
                className="underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
