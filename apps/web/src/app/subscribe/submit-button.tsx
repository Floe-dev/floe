"use client";

import { Button } from "@floe/ui";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} type="submit">
      {pending ? "Submitting..." : "Request access"}
    </Button>
  );
}
