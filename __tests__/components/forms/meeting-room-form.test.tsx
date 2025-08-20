import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { MeetingRoomForm } from "@/components/forms"
import { submitMeetingRoomForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { messages } from "@/lib/i18n"
import { toast } from "@/components/ui"
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
vi.mock("@/components/ui", async (importActual) => {
  const actual = (await importActual()) as any
  return { ...actual, toast: { success: vi.fn(), error: vi.fn() } }
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
vi.mock("@/lib/server-actions", () => ({ submitMeetingRoomForm: vi.fn() }))

const mockSubmit = submitMeetingRoomForm as unknown as vi.Mock

describe("MeetingRoomForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not reuse toast between submissions", async () => {
    mockSubmit.mockResolvedValueOnce({ success: true, message: "OK" })
    render(<MeetingRoomForm />)
    const form = screen.getByTestId("contact-form-meeting-room")
    await fireEvent.submit(form)
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("OK"))

    mockSubmit.mockImplementation(() => new Promise(() => {}))
    await fireEvent.submit(form)
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1))
  })

  it("shows success message and resets form", async () => {
    mockSubmit.mockResolvedValue({ success: true, message: "Success" })
    render(<MeetingRoomForm />)
    await fireEvent.submit(screen.getByTestId("contact-form-meeting-room"))
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Success"))
    expect(resetMock).toHaveBeenCalled()
  })

  it("uses fallback message and tracks errors", async () => {
    mockSubmit.mockResolvedValue({ success: false })
    render(<MeetingRoomForm />)
    await fireEvent.submit(screen.getByTestId("contact-form-meeting-room"))
    const fallback = messages.form.serverError.pl
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(fallback))
    expect(analyticsClient.trackSubmissionError).toHaveBeenCalledWith(
      "meeting-room",
      fallback,
    )
  })
})

