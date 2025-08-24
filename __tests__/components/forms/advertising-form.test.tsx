import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { AdvertisingForm } from "@/components/forms"
import { submitAdvertisingForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { messages } from "@/lib/i18n"
import { vi } from "vitest"

const resetMock = vi.fn()

vi.mock("react-hook-form", async (importActual) => {
  const actual = (await importActual()) as any
  return {
    ...actual,
    useForm: () => ({
      register: () => ({ name: "" }),
      handleSubmit: (fn: any) => async () => fn({}),
      formState: { errors: {} },
      setValue: vi.fn(),
      watch: vi.fn(),
      reset: resetMock,
    }),
  }
})
vi.mock("@/lib/analytics-client", () => ({
  analyticsClient: {
    trackFormView: vi.fn(),
    trackFormStart: vi.fn(),
    trackFieldFocus: vi.fn(),
    trackFieldBlur: vi.fn(),
    trackFieldError: vi.fn(),
    trackSubmissionAttempt: vi.fn(),
    trackSubmissionSuccess: vi.fn(),
    trackSubmissionError: vi.fn(),
    trackAbandonment: vi.fn(),
    getSessionId: vi.fn(() => "test-session"),
  },
}))
vi.mock("@/lib/server-actions", () => ({ submitAdvertisingForm: vi.fn() }))

const mockSubmit = submitAdvertisingForm as unknown as vi.Mock

describe("AdvertisingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("clears previous alert between submissions", async () => {
    mockSubmit.mockResolvedValueOnce({ success: true, message: "OK" })
    render(<AdvertisingForm />)
    const form = screen.getByTestId("contact-form-advertising")
    await fireEvent.submit(form)
    await waitFor(() =>
      expect(screen.getByTestId("form-success-alert")).toHaveTextContent("OK"),
    )

    mockSubmit.mockImplementation(() => new Promise(() => {}))
    await fireEvent.submit(form)
    await waitFor(() =>
      expect(
        screen.queryByTestId("form-success-alert"),
      ).not.toBeInTheDocument(),
    )
  })

  it("shows success alert and resets form", async () => {
    mockSubmit.mockResolvedValue({ success: true, message: "Success" })
    render(<AdvertisingForm />)
    await fireEvent.submit(screen.getByTestId("contact-form-advertising"))
    await waitFor(() =>
      expect(screen.getByTestId("form-success-alert")).toHaveTextContent(
        "Success",
      ),
    )
    expect(resetMock).toHaveBeenCalled()
  })

  it("uses fallback alert message and tracks errors", async () => {
    mockSubmit.mockResolvedValue({ success: false })
    render(<AdvertisingForm />)
    await fireEvent.submit(screen.getByTestId("contact-form-advertising"))
    const fallback = messages.form.serverError.pl
    await waitFor(() =>
      expect(screen.getByTestId("form-error-alert")).toHaveTextContent(
        fallback,
      ),
    )
    expect(analyticsClient.trackSubmissionError).toHaveBeenCalledWith(
      "advertising",
      fallback,
    )
  })
})

