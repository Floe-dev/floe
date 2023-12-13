"use client";

import Image from "next/image";
import logo from "public/logo.png";
import { signOut } from "next-auth/react";

export function Nav() {
  return (
    <nav className="flex justify-between p-4">
      <Image
        alt="Floe logo"
        className="w-auto h-6"
        placeholder="blur"
        src={logo}
      />
      <button
        className="self-start text-sm text-zinc-500"
        onClick={() => signOut()}
        type="button"
      >
        Logout
      </button>
    </nav>
  );
}
