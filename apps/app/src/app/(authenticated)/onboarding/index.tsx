"use client";

import { Button, Input, Spinner } from "@floe/ui";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormStatus } from "react-dom";
import { useState, useTransition } from "react";
import { redirect } from "next/navigation";
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
  const [_, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  // const [state, formAction] = useFormState(createWorkspace, initialState);
  const handleFormSubmit = (formData: FormData) => {
    try {
      startTransition(async () => {
        const { message: m, status, slug } = await createWorkspace(formData);

        setMessage(m);

        if (status === "error") {
          setError(true);
        }

        if (status === "success") {
          redirect(`/${slug}`);
        }
      });
    } catch (e) {
      // TODO: Add toast alert to handle error
      console.error(e);
    }
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center pt-32">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc">
          <h2 className="mb-2">Create a workspace</h2>
          <p className="mb-6">Please tell us a bit about your company.</p>
          <form action={handleFormSubmit} className="flex flex-col items-start">
            <Input
              label="Company name*"
              name="name"
              placeholder="Acme Inc"
              type="text"
            />
            <SubmitButton />
            {message ? (
              <p
                className={`mt-2 text-sm ${
                  error ? "text-red-500" : "text-green-500"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}
