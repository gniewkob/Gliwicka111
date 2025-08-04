import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "" }),
}));

import RootLayout from "@/app/layout";
import { cookies } from "next/headers";

describe("RootLayout language selection", () => {
  it("uses URL param when provided", () => {
    (cookies as any).mockReturnValue({ get: () => ({ value: "pl" }) });
    const element: any = RootLayout({ children: <div />, params: { lang: "en" } });
    expect(element.props.lang).toBe("en");
  });

  it("falls back to cookie when param missing", () => {
    (cookies as any).mockReturnValue({ get: () => ({ value: "en" }) });
    const element: any = RootLayout({ children: <div /> } as any);
    expect(element.props.lang).toBe("en");
  });
});
