import { render, screen, fireEvent, waitFor } from "@/lib/testing/test-utils"
import { vi } from "vitest"
import VirtualOfficeForm from "@/components/forms/virtual-office-form"
import { submitVirtualOfficeForm } from "@/lib/server-actions"

// Mock server actions
vi.mock("@/lib/server-actions", () => ({
  submitVirtualOfficeForm: vi.fn(),
}))

// Mock analytics
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
    hasConsent: vi.fn(() => true),
    getSessionId: vi.fn(() => "test-session-id"),
  },
}))

describe("VirtualOfficeForm", () => {
  const validFormData = {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan@example.com",
    phone: "+48123456789",
    companyName: "Test Company",
    businessType: "llc",
    package: "standard",
    startDate: "2024-02-01",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Form Rendering", () => {
    it("renders all required form fields", () => {
      render(<VirtualOfficeForm />)

      expect(screen.getByLabelText(/imię/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nazwisko/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nazwa firmy/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/typ działalności/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/pakiet usług/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/preferowana data rozpoczęcia/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/zgoda na przetwarzanie danych osobowych/i)).toBeInTheDocument()
    })

    it('renders form in English when language prop is "en"', () => {
      render(<VirtualOfficeForm language="en" />)

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    })

    it("has proper form structure and accessibility attributes", () => {
      render(<VirtualOfficeForm />)

      const form = screen.getByRole("form")
      expect(form).toBeInTheDocument()

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute("type", "submit")
    })
  })

  describe("Form Validation", () => {
    it("shows validation errors for empty required fields", async () => {
      render(<VirtualOfficeForm />)

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/imię jest wymagane/i)).toBeInTheDocument()
        expect(screen.getByText(/nazwisko jest wymagane/i)).toBeInTheDocument()
        expect(screen.getByText(/adres e-mail jest wymagany/i)).toBeInTheDocument()
        expect(screen.getByText(/telefon jest wymagany/i)).toBeInTheDocument()
      })
    })

    it("validates email format", async () => {
      render(<VirtualOfficeForm />)

      const emailField = screen.getByLabelText(/adres e-mail/i)
      fireEvent.change(emailField, { target: { value: "invalid-email" } })

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/nieprawidłowy format adresu e-mail/i)).toBeInTheDocument()
      })
    })

    it("validates phone number format", async () => {
      render(<VirtualOfficeForm />)

      const phoneField = screen.getByLabelText(/telefon/i)
      fireEvent.change(phoneField, { target: { value: "123" } })

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/nieprawidłowy format numeru telefonu/i)).toBeInTheDocument()
      })
    })

    it("requires GDPR consent checkbox to be checked", async () => {
      render(<VirtualOfficeForm />)

      // Fill all required fields except GDPR consent
      fireEvent.change(screen.getByLabelText(/imię/i), { target: { value: validFormData.firstName } })
      fireEvent.change(screen.getByLabelText(/nazwisko/i), { target: { value: validFormData.lastName } })
      fireEvent.change(screen.getByLabelText(/adres e-mail/i), { target: { value: validFormData.email } })
      fireEvent.change(screen.getByLabelText(/telefon/i), { target: { value: validFormData.phone } })

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/zgoda na przetwarzanie danych jest wymagana/i)).toBeInTheDocument()
      })
    })
  })

  describe("Form Submission", () => {
    it("submits form with valid data successfully", async () => {
      const mockSubmit = vi.mocked(submitVirtualOfficeForm)
      mockSubmit.mockResolvedValue({ success: true, message: "Formularz został wysłany pomyślnie" })

      render(<VirtualOfficeForm />)

      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/imię/i), { target: { value: validFormData.firstName } })
      fireEvent.change(screen.getByLabelText(/nazwisko/i), { target: { value: validFormData.lastName } })
      fireEvent.change(screen.getByLabelText(/adres e-mail/i), { target: { value: validFormData.email } })
      fireEvent.change(screen.getByLabelText(/telefon/i), { target: { value: validFormData.phone } })
      fireEvent.change(screen.getByLabelText(/nazwa firmy/i), { target: { value: validFormData.companyName } })

      // Select business type
      const businessTypeSelect = screen.getByLabelText(/typ działalności/i)
      fireEvent.change(businessTypeSelect, { target: { value: validFormData.businessType } })

      // Select package
      const packageSelect = screen.getByLabelText(/pakiet usług/i)
      fireEvent.change(packageSelect, { target: { value: validFormData.package } })

      // Set start date
      fireEvent.change(screen.getByLabelText(/preferowana data rozpoczęcia/i), {
        target: { value: validFormData.startDate },
      })

      // Check GDPR consent
      fireEvent.click(screen.getByLabelText(/zgoda na przetwarzanie danych osobowych/i))

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData))
        expect(screen.getByText(/formularz został wysłany pomyślnie/i)).toBeInTheDocument()
      })
    })

    it("handles submission errors gracefully", async () => {
      const mockSubmit = vi.mocked(submitVirtualOfficeForm)
      mockSubmit.mockResolvedValue({ success: false, message: "Wystąpił błąd podczas wysyłania" })

      render(<VirtualOfficeForm />)

      // Fill form with valid data
      Object.entries(validFormData).forEach(([key, value]) => {
        const field = screen.getByLabelText(new RegExp(key, "i"))
        if (field) {
          fireEvent.change(field, { target: { value } })
        }
      })

      fireEvent.click(screen.getByLabelText(/zgoda na przetwarzanie danych osobowych/i))

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/wystąpił błąd podczas wysyłania/i)).toBeInTheDocument()
      })
    })

    it("shows loading state during submission", async () => {
      const mockSubmit = vi.mocked(submitVirtualOfficeForm)
      mockSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, message: "Success" }), 1000)),
      )

      render(<VirtualOfficeForm />)

      // Fill form with valid data and submit
      Object.entries(validFormData).forEach(([key, value]) => {
        const field = screen.getByLabelText(new RegExp(key, "i"))
        if (field) {
          fireEvent.change(field, { target: { value } })
        }
      })

      fireEvent.click(screen.getByLabelText(/zgoda na przetwarzanie danych osobowych/i))

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      // Check loading state
      expect(screen.getByText(/wysyłanie/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  describe("Analytics Integration", () => {
    it("tracks form view on mount", () => {
      const { analyticsClient } = require("@/lib/analytics-client")

      render(<VirtualOfficeForm />)

      expect(analyticsClient.trackFormView).toHaveBeenCalledWith("virtual-office")
    })

    it("tracks field focus and blur events", async () => {
      const { analyticsClient } = require("@/lib/analytics-client")

      render(<VirtualOfficeForm />)

      const firstNameField = screen.getByLabelText(/imię/i)

      fireEvent.focus(firstNameField)
      expect(analyticsClient.trackFieldFocus).toHaveBeenCalledWith("virtual-office", "firstName")

      fireEvent.blur(firstNameField)
      expect(analyticsClient.trackFieldBlur).toHaveBeenCalledWith("virtual-office", "firstName")
    })

    it("tracks submission attempts and results", async () => {
      const { analyticsClient } = require("@/lib/analytics-client")
      const mockSubmit = vi.mocked(submitVirtualOfficeForm)
      mockSubmit.mockResolvedValue({ success: true, message: "Success" })

      render(<VirtualOfficeForm />)

      // Fill and submit form
      Object.entries(validFormData).forEach(([key, value]) => {
        const field = screen.getByLabelText(new RegExp(key, "i"))
        if (field) {
          fireEvent.change(field, { target: { value } })
        }
      })

      fireEvent.click(screen.getByLabelText(/zgoda na przetwarzanie danych osobowych/i))
      fireEvent.click(screen.getByRole("button", { name: /wyślij zapytanie/i }))

      await waitFor(() => {
        expect(analyticsClient.trackSubmissionAttempt).toHaveBeenCalled()
        expect(analyticsClient.trackSubmissionSuccess).toHaveBeenCalled()
      })
    })
  })

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(<VirtualOfficeForm />)

      const form = screen.getByRole("form")
      expect(form).toHaveAttribute("aria-label", expect.stringContaining("Virtual Office"))

      const requiredFields = screen.getAllByText("*")
      expect(requiredFields.length).toBeGreaterThan(0)
    })

    it("associates labels with form controls", () => {
      render(<VirtualOfficeForm />)

      const firstNameField = screen.getByLabelText(/imię/i)
      expect(firstNameField).toHaveAttribute("id")

      const label = screen.getByText(/imię/i)
      expect(label).toHaveAttribute("for", firstNameField.getAttribute("id"))
    })

    it("provides error messages with proper ARIA attributes", async () => {
      render(<VirtualOfficeForm />)

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText(/imię jest wymagane/i)
        expect(errorMessage).toHaveAttribute("role", "alert")
        expect(errorMessage).toHaveAttribute("aria-live", "polite")
      })
    })
  })

  describe("Responsive Design", () => {
    it("adapts to mobile viewport", () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<VirtualOfficeForm />)

      const form = screen.getByRole("form")
      expect(form).toHaveClass("space-y-6") // Tailwind spacing class
    })

    it("maintains usability on tablet viewport", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(<VirtualOfficeForm />)

      const submitButton = screen.getByRole("button", { name: /wyślij zapytanie/i })
      expect(submitButton).toBeVisible()
    })
  })
})
