"use client";

import { Button, Input, Spinner } from "@floe/ui";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormStatus } from "react-dom";
import { useState, useTransition } from "react";
import { createWorkspace } from "./actions";
import { useStepsContext } from "./context";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full mt-6" disabled={pending} type="submit">
      {pending ? <Spinner /> : "Continue"}
    </Button>
  );
}

export function Step1() {
  const [_, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { step, setSearchParams, workspace } = useStepsContext();

  // const [state, formAction] = useFormState(createWorkspace, initialState);
  const handleFormSubmit = (formData: FormData) => {
    if (workspace) {
      setSearchParams({
        s: step + 1,
      });

      return;
    }

    try {
      startTransition(async () => {
        const { message: m, status, slug } = await createWorkspace(formData);

        setMessage(m);

        if (status === "error") {
          setError(true);
        }

        if (status === "success") {
          setSearchParams({
            w: slug,
            s: step + 1,
          });
        }
      });
    } catch (e) {
      // TODO: Add toast alert to handle error
      console.error(e);
    }
  };

  return (
    <>
      <h2 className="mt-0 mb-2">Create a workspace</h2>
      <p className="mb-10">Please tell us a bit about your company.</p>
      <form action={handleFormSubmit} className="flex flex-col items-start">
        <Input
          disabled={Boolean(workspace)}
          label="Company name*"
          name="name"
          placeholder="Acme Inc"
          type="text"
          value={workspace?.name}
        />
        <SubmitButton />
        {message && error ? (
          <p className="mt-2 text-sm text-red-500">{message}</p>
        ) : null}
      </form>
    </>
  );
}
