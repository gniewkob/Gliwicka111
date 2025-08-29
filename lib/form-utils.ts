"use client";

import type React from "react";

import type { FieldError } from "react-hook-form";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Form field validation utilities
export const validateField = (
  value: string,
  rules: ValidationRule[],
): string | null => {
  for (const rule of rules) {
    const error = rule.validate(value);
    if (error) return error;
  }
  return null;
};

export interface ValidationRule {
  validate: (value: string) => string | null;
}

export const createRequiredRule = (message: string): ValidationRule => ({
  validate: (value: string) => (value.trim() ? null : message),
});

export const createMinLengthRule = (
  minLength: number,
  message: string,
): ValidationRule => ({
  validate: (value: string) => (value.length >= minLength ? null : message),
});

export const createMaxLengthRule = (
  maxLength: number,
  message: string,
): ValidationRule => ({
  validate: (value: string) => (value.length <= maxLength ? null : message),
});

export const createRegexRule = (
  regex: RegExp,
  message: string,
): ValidationRule => ({
  validate: (value: string) => (regex.test(value) ? null : message),
});

// Form data sanitization
export const sanitizeFormData = (
  data: Record<string, any>,
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      // Remove potentially dangerous characters and trim whitespace
      sanitized[key] = value
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "");
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? item.trim() : item,
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Error message formatting
export const formatFieldError = (
  error: FieldError | undefined,
  fieldName: string,
): string => {
  if (!error) return "";

  switch (error.type) {
    case "required":
      return `${fieldName} jest wymagane`;
    case "minLength":
      return `${fieldName} jest za krótkie`;
    case "maxLength":
      return `${fieldName} jest za długie`;
    case "pattern":
      return `${fieldName} ma nieprawidłowy format`;
    default:
      return error.message || `${fieldName} jest nieprawidłowe`;
  }
};

// Form submission utilities
export const prepareFormSubmission = (
  data: Record<string, any>,
  formType: string,
) => {
  const sanitizedData = sanitizeFormData(data);

  return {
    ...sanitizedData,
    formType,
    submittedAt: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
    referrer: typeof window !== "undefined" ? document.referrer : "",
  };
};

// GDPR compliance utilities
export const createGDPRCompliantSubmission = (data: Record<string, any>) => {
  // Remove sensitive data that shouldn't be stored
  const { userAgent, referrer, ...cleanData } = data;

  return {
    ...cleanData,
    dataProcessingConsent: true,
    consentTimestamp: new Date().toISOString(),
    dataRetentionPeriod: "12 months",
  };
};

// Form analytics utilities
export const trackFormInteraction = (
  eventType: string,
  formType: string,
  fieldName?: string,
  metadata?: Record<string, any>,
) => {
  if (typeof window !== "undefined") {
    window.gtag?.("event", eventType, {
      form_type: formType,
      field_name: fieldName,
      ...metadata,
    });
  }
};

// Accessibility utilities
export const announceToScreenReader = (message: string) => {
  if (typeof window === "undefined") return;

  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Form state management
export const createFormState = <T extends Record<string, any>>(
  initialData: T,
) => {
  return {
    data: initialData,
    errors: {} as Record<keyof T, string>,
    touched: {} as Record<keyof T, boolean>,
    isSubmitting: false,
    isValid: false,
  };
};

// Debounce utility for form validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): T => {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

// Form field focus management
export const manageFocus = (formRef: React.RefObject<HTMLFormElement>) => {
  const focusFirstError = () => {
    if (!formRef.current) return;

    const firstErrorField = formRef.current.querySelector(
      '[aria-invalid="true"]',
    ) as HTMLElement;
    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const focusNextField = (currentFieldName: string, fieldOrder: string[]) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    if (currentIndex >= 0 && currentIndex < fieldOrder.length - 1) {
      const nextFieldName = fieldOrder[currentIndex + 1];
      const nextField = formRef.current?.querySelector(
        `[name="${nextFieldName}"]`,
      ) as HTMLElement;
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return { focusFirstError, focusNextField };
};
