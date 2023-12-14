"use client";

import { signIn } from "next-auth/react";
import { Button, Input } from "@floe/ui";
import Image from "next/image";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import logo from "public/logo.png";

function Form() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    void signIn("sendgrid", { email, callbackUrl });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full pt-32">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc flex flex-col">
        <span className="mx-auto">
          <Image alt="Floe logo" className="w-auto h-8 m-0" src={logo} />
        </span>
        <div className="my-10 text-center">
          <h2 className="mt-0 mb-2">Welcome</h2>
          <p className="mb-0">Please enter your company email to continue.</p>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              autoComplete="email"
              id="email"
              label="Email"
              name="email"
              placeholder="me@acme.com"
              required
              type="email"
            />
          </div>
          <Button className="w-full" type="submit">
            Continue with email
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Form;
