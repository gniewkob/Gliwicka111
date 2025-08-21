import { render, screen, fireEvent } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { virtualOfficeFormSchema, type VirtualOfficeFormData } from "@/lib/validation-schemas"

function EmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VirtualOfficeFormData>({ resolver: zodResolver(virtualOfficeFormSchema) })

  return (
    <form onSubmit={handleSubmit(() => {})} data-testid="email-form">
      <input aria-label="email" type="email" {...register("email")}/>
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit">submit</button>
    </form>
  )
}

describe("email field validation", () => {
  it("shows message for invalid email", async () => {
    render(<EmailForm />)
    const form = screen.getByTestId("email-form")
    const input = screen.getByLabelText(/email/i)
    fireEvent.change(input, { target: { value: "invalid-email" } })
    fireEvent.submit(form)
    expect(await screen.findByText("Nieprawidłowy format adresu email")).toBeInTheDocument()
    expect(input).toHaveValue("invalid-email")
  })
})
