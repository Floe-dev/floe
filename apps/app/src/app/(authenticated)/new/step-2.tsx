"use client";

import { Button, Input, Spinner } from "@floe/ui";
// @ts-expect-error -- Expected according to: https://github.com/vercel/next.js/issues/56041
import { useFormStatus } from "react-dom";
import { useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { createWorkspace } from "./actions";
import Link from "next/link";

export function Step2() {
  return (
    <>
      <h2 className="mb-2">Connect</h2>
      <p className="mb-6">Floe relies on git providers for context.</p>
      {/* <Link
        href={`https://github.com/apps/floe-app/installations/new?state=${workspace.slug}`}
      >
        <Button>Connect to GitHub</Button>
      </Link> */}
    </>
  );
}
