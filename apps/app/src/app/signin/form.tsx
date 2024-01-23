"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Input } from "@floe/ui";
import Image from "next/image";
import type { FormEvent } from "react";
import { Spinner } from "@floe/ui";
import { useSearchParams } from "next/navigation";
import logo from "public/logo.png";

function Form() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const email = event.currentTarget.email.value;
    setLoading(true);
    await signIn("sendgrid", { email, callbackUrl }).finally(() => {
      setLoading(false);
    });
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
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? <Spinner /> : "Continue with email"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Form;
