"use client";

import { Input } from "@floe/ui";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormState } from "react-dom";
import { subscribe } from "./actions";
import { SubmitButton } from "./submit-button";

const initialState = {
  message: null,
};

export function Subscribe() {
  const [state, formAction] = useFormState(subscribe, initialState);

  return (
    <form action={formAction} className="flex items-start gap-2">
      <Input
        icon={EnvelopeIcon}
        name="email"
        placeholder="Company email"
        subtext={state?.message ? state.message : "Apply for the Floe Beta."}
        type="email"
      />
      <SubmitButton />
    </form>
  );
}
