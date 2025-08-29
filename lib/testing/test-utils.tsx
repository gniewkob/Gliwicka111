import type React from "react";
import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { vi, expect, type Mock } from "vitest";

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
};

vi.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Test utilities
export const createMockFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
};

export const waitForFormSubmission = async (submitButton: HTMLElement) => {
  const { waitFor } = await import("@testing-library/react");
  await waitFor(
    () => {
      expect(submitButton).not.toBeDisabled();
    },
    { timeout: 5000 },
  );
};

export const mockAnalyticsClient = {
  trackFormView: vi.fn(),
  trackFormStart: vi.fn(),
  trackFieldFocus: vi.fn(),
  trackFieldBlur: vi.fn(),
  trackFieldError: vi.fn(),
  trackSubmissionAttempt: vi.fn(),
  trackSubmissionSuccess: vi.fn(),
  trackSubmissionError: vi.fn(),
  trackAbandonment: vi.fn(),
  hasConsent: vi.fn(() => true),
  getSessionId: vi.fn(() => "test-session-id"),
};

// Mock analytics client
vi.mock("@/lib/analytics-client", () => ({
  analyticsClient: mockAnalyticsClient,
}));

// Form test helpers
export const fillFormField = async (
  getByLabelText: (text: string | RegExp) => HTMLElement,
  label: string,
  value: string,
) => {
  const { fireEvent } = await import("@testing-library/react");
  const field = getByLabelText(new RegExp(label, "i"));
  fireEvent.change(field, { target: { value } });
  return field;
};

export const selectFormOption = async (
  getByRole: (role: string, options?: any) => HTMLElement,
  selectLabel: string,
  optionText: string,
) => {
  const { fireEvent } = await import("@testing-library/react");
  const select = getByRole("combobox", { name: new RegExp(selectLabel, "i") });
  fireEvent.click(select);

  const option = getByRole("option", { name: new RegExp(optionText, "i") });
  fireEvent.click(option);

  return select;
};

export const checkFormCheckbox = async (
  getByLabelText: (text: string | RegExp) => HTMLElement,
  label: string,
) => {
  const { fireEvent } = await import("@testing-library/react");
  const checkbox = getByLabelText(new RegExp(label, "i"));
  fireEvent.click(checkbox);
  return checkbox;
};

// API mocking utilities
export const mockSuccessfulSubmission = () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          message: "Form submitted successfully",
        }),
    }),
  ) as Mock;
};

export const mockFailedSubmission = (errorMessage = "Submission failed") => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () =>
        Promise.resolve({
          success: false,
          message: errorMessage,
        }),
    }),
  ) as Mock;
};

export const mockNetworkError = () => {
  global.fetch = vi.fn(() =>
    Promise.reject(new Error("Network error")),
  ) as Mock;
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();
  return endTime - startTime;
};

// Accessibility testing utilities
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import("jest-axe");
  expect.extend(toHaveNoViolations);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Visual regression testing setup
export const setupVisualTesting = () => {
  // Configure visual testing tools like Percy or Chromatic
  return {
    takeSnapshot: (name: string, element: HTMLElement) => {
      // Implementation would depend on chosen visual testing tool
      console.log(`Taking snapshot: ${name}`);
    },
  };
};
