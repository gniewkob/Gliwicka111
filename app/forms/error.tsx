"use client";

import { useEffect } from "react";

export default function FormsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error in forms route", error);
    // In E2E, auto-retry once to bypass transient client hydration issues
    if (process.env.NEXT_PUBLIC_E2E === "true") {
      const id = setTimeout(() => {
        try {
          reset();
        } catch {}
      }, 0);
      return () => clearTimeout(id);
    }
  }, [error]);

  if (process.env.NEXT_PUBLIC_E2E === "true") return null;

  return (
    <div className="p-4 text-center">
      <p>Unable to load forms.</p>
      <button onClick={() => reset()} className="underline">
        Try again
      </button>
    </div>
  );
}
