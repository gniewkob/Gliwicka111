import HomePage from "@/app/page";
import { LanguageProvider } from "@/components/language-provider";
import { render, screen } from "@/lib/testing/test-utils";

describe("hero image placeholder", () => {
  it("has correct classes", () => {
    render(
      <LanguageProvider initialLanguage="pl">
        <HomePage />
      </LanguageProvider>,
    );

    const placeholder = screen.getByTestId("hero-image-placeholder");
    expect(placeholder).toHaveClass("w-full");
    expect(placeholder).toHaveClass("aspect-square");
    expect(placeholder).toHaveClass("overflow-hidden");
    expect(placeholder).toHaveClass("relative");

    const image = screen.getByTestId("hero-image");
    expect(image).toHaveClass("object-cover");
    expect(image).toHaveClass("object-center");
  });
});
