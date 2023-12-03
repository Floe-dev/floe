"use client";

import { signOut } from "next-auth/react";

export function Nav() {
  return (
    <nav>
      <button onClick={() => signOut()} type="button">
        Sign out
      </button>
    </nav>
  );
}
