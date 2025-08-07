import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { VirtualOfficeForm } from "@/components/forms"
import { submitVirtualOfficeForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { vi } from "vitest"

// Mock dependencies
vi.mock("@/lib/server-actions", () => ({
  submitVirtualOfficeForm: vi.fn(),
}))

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

const mockSubmitVirtualOfficeForm = submitVirtualOfficeForm as vi.MockedFunction<typeof submitVirtualOfficeForm>

describe.skip("VirtualOfficeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders all form fields", () => {
    render(<VirtualOfficeForm />)

    expect(screen.getByLabelText(/nazwa firmy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/imię/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nazwisko/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nip/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rodzaj działalności/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/preferowany termin/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/dodatkowe informacje/i)).toBeInTheDocument()
  })

  it("validates required fields", async () => {
    const user = userEvent.setup()
    render(<VirtualOfficeForm />)

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/nazwa firmy jest wymagana/i)).toBeInTheDocument()
      expect(screen.getByText(/imię jest wymagane/i)).toBeInTheDocument()
      expect(screen.getByText(/nazwisko jest wymagane/i)).toBeInTheDocument()
      expect(screen.getByText(/email jest wymagany/i)).toBeInTheDocument()
      expect(screen.getByText(/telefon jest wymagany/i)).toBeInTheDocument()
    })
  })

  it("validates email format", async () => {
    const user = userEvent.setup()
    render(<VirtualOfficeForm />)

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, "invalid-email")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowy format email/i)).toBeInTheDocument()
    })
  })

  it("validates phone number format", async () => {
    const user = userEvent.setup()
    render(<VirtualOfficeForm />)

    const phoneInput = screen.getByLabelText(/telefon/i)
    await user.type(phoneInput, "123")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowy format numeru telefonu/i)).toBeInTheDocument()
    })
  })

  it("validates NIP format when provided", async () => {
    const user = userEvent.setup()
    render(<VirtualOfficeForm />)

    const nipInput = screen.getByLabelText(/nip/i)
    await user.type(nipInput, "123")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowy format nip/i)).toBeInTheDocument()
    })
  })

  it("submits form with valid data", async () => {
    const user = userEvent.setup()
    mockSubmitVirtualOfficeForm.mockResolvedValue({ success: true, message: "Formularz został wysłany" })

    render(<VirtualOfficeForm />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/nazwa firmy/i), "Test Company")
    await user.type(screen.getByLabelText(/imię/i), "Jan")
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski")
    await user.type(screen.getByLabelText(/email/i), "jan@example.com")
    await user.type(screen.getByLabelText(/telefon/i), "+48 123 456 789")
    await user.type(screen.getByLabelText(/nip/i), "1234567890")
    await user.selectOptions(screen.getByLabelText(/rodzaj działalności/i), "consulting")
    await user.type(screen.getByLabelText(/preferowany termin/i), "2024-12-01")
    await user.type(screen.getByLabelText(/dodatkowe informacje/i), "Test message")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSubmitVirtualOfficeForm).toHaveBeenCalledWith(
        expect.any(FormData),
      )
    })
  })

  it("displays success message after successful submission", async () => {
    const user = userEvent.setup()
    mockSubmitVirtualOfficeForm.mockResolvedValue({ success: true, message: "Formularz został wysłany" })

    render(<VirtualOfficeForm />)

    // Fill in required fields and submit
    await user.type(screen.getByLabelText(/nazwa firmy/i), "Test Company")
    await user.type(screen.getByLabelText(/imię/i), "Jan")
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski")
    await user.type(screen.getByLabelText(/email/i), "jan@example.com")
    await user.type(screen.getByLabelText(/telefon/i), "+48 123 456 789")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/formularz został wysłany/i)).toBeInTheDocument()
    })
  })

  it("displays error message on submission failure", async () => {
    const user = userEvent.setup()
    mockSubmitVirtualOfficeForm.mockResolvedValue({ success: false, message: "Błąd podczas wysyłania" })

    render(<VirtualOfficeForm />)

    // Fill in required fields and submit
    await user.type(screen.getByLabelText(/nazwa firmy/i), "Test Company")
    await user.type(screen.getByLabelText(/imię/i), "Jan")
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski")
    await user.type(screen.getByLabelText(/email/i), "jan@example.com")
    await user.type(screen.getByLabelText(/telefon/i), "+48 123 456 789")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/błąd podczas wysyłania/i)).toBeInTheDocument()
    })
  })

  it("disables submit button during submission", async () => {
    const user = userEvent.setup()
    mockSubmitVirtualOfficeForm.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true, message: "Success" }), 1000)),
    )

    render(<VirtualOfficeForm />)

    // Fill in required fields
    await user.type(screen.getByLabelText(/nazwa firmy/i), "Test Company")
    await user.type(screen.getByLabelText(/imię/i), "Jan")
    await user.type(screen.getByLabelText(/nazwisko/i), "Kowalski")
    await user.type(screen.getByLabelText(/email/i), "jan@example.com")
    await user.type(screen.getByLabelText(/telefon/i), "+48 123 456 789")

    const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
    await user.click(submitButton)

    expect(screen.getByRole("button", { name: /wysyłanie/i })).toBeDisabled()
  })

  it("tracks analytics events", async () => {
    const user = userEvent.setup()
    const mockTrackFormView = analyticsClient.trackFormView as vi.Mock
    const mockTrackFormStart = analyticsClient.trackFormStart as vi.Mock

    render(<VirtualOfficeForm />)

    expect(mockTrackFormView).toHaveBeenCalledWith("virtual-office")

    const firstInput = screen.getByLabelText(/nazwa firmy/i)
    await user.click(firstInput)

    expect(mockTrackFormStart).toHaveBeenCalledWith("virtual-office")
  })
})
