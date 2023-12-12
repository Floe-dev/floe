"use client";

import { Button, Input, Spinner } from "@floe/ui";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormState, useFormStatus } from "react-dom";
import { Nav } from "./nav";
import { createWorkspace } from "./actions";

const initialState = {
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full mt-3" disabled={pending} type="submit">
      {pending ? <Spinner /> : "Continue"}
    </Button>
  );
}

export function Onboarding() {
  const [state, formAction] = useFormState(createWorkspace, initialState);

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center pt-32">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc">
          <h2 className="mb-2">Create a workspace</h2>
          <p className="mb-6">Please tell us a bit about your company.</p>
          <form action={createWorkspace} className="flex flex-col items-start">
            <Input
              label="Company name*"
              name="name"
              placeholder="Acme Inc"
              type="text"
            />
            <SubmitButton />
          </form>
        </div>
      </div>
    </>
  );
}
