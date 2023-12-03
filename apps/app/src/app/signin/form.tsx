"use client";

import { signIn } from "next-auth/react";
import type { getProviders } from "next-auth/react";
import { Button, Input } from "@floe/ui";
import Image from "next/image";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import logo from "public/logo.png";

function Form({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}): JSX.Element | undefined {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  if (!providers) {
    return undefined;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    void signIn("sendgrid", { email, callbackUrl });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Image
        alt="Floe logo"
        className="w-auto h-8"
        placeholder="blur"
        src={logo}
      />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="p-12 text-center bg-white rounded-lg shadow">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            👋 Welcome!
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="hello@me.com"
                required
                type="email"
              />
            </div>
            <Button
              className="w-full mt-3"
              color="gray"
              type="submit"
              variant="outline"
            >
              Continue with email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
