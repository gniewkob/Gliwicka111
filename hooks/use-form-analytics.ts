"use client";

import { useEffect, useRef, useCallback } from "react";
import { analyticsClient } from "@/lib/analytics-client";

interface UseFormAnalyticsOptions {
  formType:
    | "virtual-office"
    | "coworking"
    | "meeting-room"
    | "advertising"
    | "special-deals";
  enabled?: boolean;
}

interface FormAnalyticsHook {
  trackFormView: () => void;
  trackFormStart: () => void;
  trackFieldFocus: (fieldName: string) => void;
  trackFieldBlur: (fieldName: string) => void;
  trackFieldError: (fieldName: string, errorMessage: string) => void;
  trackSubmissionAttempt: () => void;
  trackSubmissionSuccess: () => void;
  trackSubmissionError: (errorMessage: string) => void;
  trackAbandonment: () => void;
}

/**
 * Provides utilities for tracking detailed form interaction events.
 *
 * This hook wraps calls to the `analyticsClient` and keeps internal state so
 * events such as abandonment or repeated views are only sent once. Call the
 * returned helpers at the appropriate points in your form lifecycle.
 *
 * @param {UseFormAnalyticsOptions} options - Configuration for the hook.
 * @param {string} options.formType - Identifier of the form being tracked.
 * @param {boolean} [options.enabled=true] - Whether analytics should be sent.
 * @returns {FormAnalyticsHook} Collection of tracking functions.
 *
 * @example
 * const {
 *   trackFormView,
 *   trackFormStart,
 *   trackSubmissionSuccess,
 * } = useFormAnalytics({ formType: "virtual-office" });
 *
 * trackFormView(); // record that the form was displayed
 */
export function useFormAnalytics({
  formType,
  enabled = true,
}: UseFormAnalyticsOptions): FormAnalyticsHook {
  const hasTrackedView = useRef(false);
  const hasTrackedStart = useRef(false);
  const startTime = useRef<number | null>(null);
  const fieldInteractions = useRef<Set<string>>(new Set());

  // Track form view on mount
  useEffect(() => {
    if (enabled && !hasTrackedView.current) {
      analyticsClient.trackFormView(formType);
      hasTrackedView.current = true;
      startTime.current = Date.now();
    }
  }, [formType, enabled]);

  // Track abandonment on unmount (if form was started but not completed)
  useEffect(() => {
    return () => {
      if (
        enabled &&
        hasTrackedStart.current &&
        fieldInteractions.current.size > 0
      ) {
        analyticsClient.trackAbandonment(formType);
      }
    };
  }, [formType, enabled]);

  const trackFormView = useCallback(() => {
    if (!enabled) return;
    if (!hasTrackedView.current) {
      analyticsClient.trackFormView(formType);
      hasTrackedView.current = true;
      startTime.current = Date.now();
    }
  }, [formType, enabled]);

  const trackFormStart = useCallback(() => {
    if (!enabled) return;
    if (!hasTrackedStart.current) {
      analyticsClient.trackFormStart(formType);
      hasTrackedStart.current = true;
    }
  }, [formType, enabled]);

  const trackFieldFocus = useCallback(
    (fieldName: string) => {
      if (!enabled) return;
      analyticsClient.trackFieldFocus(formType, fieldName);
      fieldInteractions.current.add(fieldName);

      // Auto-track form start on first field interaction
      if (!hasTrackedStart.current) {
        trackFormStart();
      }
    },
    [formType, enabled, trackFormStart],
  );

  const trackFieldBlur = useCallback(
    (fieldName: string) => {
      if (!enabled) return;
      analyticsClient.trackFieldBlur(formType, fieldName);
    },
    [formType, enabled],
  );

  const trackFieldError = useCallback(
    (fieldName: string, errorMessage: string) => {
      if (!enabled) return;
      analyticsClient.trackFieldError(formType, fieldName, errorMessage);
    },
    [formType, enabled],
  );

  const trackSubmissionAttempt = useCallback(() => {
    if (!enabled) return;
    analyticsClient.trackSubmissionAttempt(formType);
  }, [formType, enabled]);

  const trackSubmissionSuccess = useCallback(() => {
    if (!enabled) return;
    analyticsClient.trackSubmissionSuccess(formType);
    // Reset tracking state for potential reuse
    hasTrackedStart.current = false;
    fieldInteractions.current.clear();
  }, [formType, enabled]);

  const trackSubmissionError = useCallback(
    (errorMessage: string) => {
      if (!enabled) return;
      analyticsClient.trackSubmissionError(formType, errorMessage);
    },
    [formType, enabled],
  );

  const trackAbandonment = useCallback(() => {
    if (!enabled) return;
    if (hasTrackedStart.current && fieldInteractions.current.size > 0) {
      analyticsClient.trackAbandonment(formType);
    }
  }, [formType, enabled]);

  return {
    trackFormView,
    trackFormStart,
    trackFieldFocus,
    trackFieldBlur,
    trackFieldError,
    trackSubmissionAttempt,
    trackSubmissionSuccess,
    trackSubmissionError,
    trackAbandonment,
  };
}

/**
 * Sends a single page view event when the component mounts.
 *
 * @param {string} pageName - Name of the page being viewed.
 * @param {boolean} [enabled=true] - Set to `false` to disable analytics.
 */
export function usePageAnalytics(pageName: string, enabled = true) {
  useEffect(() => {
    if (enabled && typeof window !== "undefined") {
      // Track page view
      analyticsClient.trackFormView(pageName);
    }
  }, [pageName, enabled]);
}

/**
 * Tracks whether the user stays engaged with the page and measures the
 * engagement duration. Helpful for analytics dashboards that need to know how
 * long users actively view a page.
 *
 * @param {boolean} [enabled=true] - When `false`, no listeners are attached.
 * @returns {{ isEngaged: boolean; getEngagementTime: () => number }} Current
 * engagement state helpers.
 */
export function useEngagementTracking(enabled = true) {
  const engagementStartTime = useRef<number>(Date.now());
  const isEngaged = useRef<boolean>(true);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isEngaged.current = false;
      } else {
        isEngaged.current = true;
        engagementStartTime.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const engagementTime = Date.now() - engagementStartTime.current;
      if (engagementTime > 30000) {
        // Only track if engaged for more than 30 seconds
        // Track engagement time (you can extend analyticsClient for this)
        console.log("User engagement time:", engagementTime);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);

  return {
    isEngaged: isEngaged.current,
    getEngagementTime: () => Date.now() - engagementStartTime.current,
  };
}
