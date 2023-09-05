"use client";

import { signIn } from "next-auth/react";
import { getProviders } from "next-auth/react";
import { Button } from "@/components";
import logo from "public/logo.png";
import github from "public/github.png";
import Image from "next/image";

const Form = ({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) => {
  if (!providers) {
    return undefined;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Image
        src={logo}
        alt="Floe logo"
        className="w-auto h-8"
        placeholder="blur"
      />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="p-12 text-center bg-white rounded-lg shadow">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            👋 Welcome!
          </h1>
          <p className="mb-6 text-gray-500">Sign in to your GitHub account.</p>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button onClick={() => signIn(provider.id)} variant="primary">
                <Image
                  src={github}
                  alt="Github"
                  className="w-auto h-4"
                  placeholder="blur"
                />
                Continue with {provider.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Form;
