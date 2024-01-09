import Link from "next/link";
import { Button, Pill } from "@floe/ui";

export function BetaCard() {
  return (
    <div className="relative z-10 px-10 py-8 -mx-10 rounded-lg shadow-lg md:mx-auto sm:w-2/3 bg-gradient-to-t from-amber-500 bg-amber-400 after:absolute after:bg-noise after:inset-0 after:opacity-60 after:-z-10">
      <Pill color="black" text="Closed Beta Program" />
      <h3 className="mt-3 mb-3 text-4xl sm:text-5xl font-garamond">
        Help write the future.
      </h3>
      <p className="mb-8 text-lg sm:text-xl text-zinc-700">
        The Floe Closed Beta will offer early access to the Floe CLI and CI
        platform. Beta Partners will also benefit from dedicated integration
        support, and crucially, the opportunity to help shape the product.
      </p>
      <div className="flex justify-center gap-4 sm:justify-start">
        <Link
          className="flex items-center gap-x-1"
          href="https://cal.com/nic-haley/book-a-demo"
          target="_blank"
        >
          <Button color="secondary" size="lg">
            Book a demo
          </Button>
        </Link>
        <Link href="mailto:nic@floe.dev?subject=👋 I'd like to learn more about Floe">
          <Button color="secondary" size="lg" variant="text">
            Contact us
          </Button>
        </Link>
      </div>
    </div>
  );
}
