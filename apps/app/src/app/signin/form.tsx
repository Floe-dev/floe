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
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc">
        <Image
          alt="Floe logo"
          className="w-auto h-6"
          placeholder="blur"
          src={logo}
        />
        <h2 className="mb-2">Welcome</h2>
        <p className="mb-6">Please enter your company email to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              autoComplete="email"
              id="email"
              label="Email"
              name="email"
              placeholder="hello@me.com"
              required
              type="email"
            />
          </div>
          <Button className="w-full mt-3" type="submit">
            Continue with email
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Form;
