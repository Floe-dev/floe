import Link from "next/link";
import Image from "next/image";
import { Button, Pill } from "@floe/ui";
import PencilArt from "public/pencil-art.png";
import {
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Blob } from "./blob";
import { Title } from "./title";
import { Card } from "./card";
import { BetaCard } from "./beta-card";
import { Carousel } from "./carousel";

export default function Home(): JSX.Element {
  return (
    <div className="relative overflow-x-hidden bg-white isolate bg-noise after:bg-gradient-to-t after:from-zinc-900 after:opacity-20 after:-z-30 after:absolute after:inset-0">
      <div className="px-6 pt-20 mx-auto max-w-7xl sm:pt-28 lg:px-8 lg:pt-32">
        <section className="lg:flex lg:items-center lg:gap-x-10">
          <div className="max-w-2xl mx-auto lg:mx-0 lg:flex-auto">
            <Pill text="Coming soon" />
            <Title />
            <p className="mt-4 mb-10 text-xl leading-8 sm:text-2xl sm:mt-6 sm:mb-10 text-zinc-600">
              Meet your new AI-powered writing assistant. Floe is the CICD
              platform for writing better docs without the headache.
            </p>
            <div className="flex justify-center gap-4 sm:justify-start">
              <Link
                className="flex items-center gap-x-1"
                href="https://cal.com/nic-haley/book-a-demo"
                target="_blank"
              >
                <Button size="xl">Book a demo</Button>
              </Link>
              <Link href="mailto:nic@floe.dev?subject=👋 I'd like to learn more about Floe">
                <Button color="secondary" size="xl" variant="text">
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <Blob />
          </div>
        </section>
        <section className="my-20 sm:my-40">
          <div className="m-auto sm:w-4/5">
            <Carousel />
          </div>
        </section>
        <section className="my-20 sm:my-40">
          <div className="mb-10 text-center sm:mb-20">
            <Image
              alt="Pencil illustration"
              className="w-32 h-32 mx-auto mb-3 md:h-40 md:w-40"
              src={PencilArt}
            />
            <h2 className="mb-4 text-4xl sm:text-5xl font-garamond">
              Save time, all the time.
            </h2>
            <h4 className="text-lg sm:text-xl text-zinc-600">
              Take the grunt work out of writing. Floe is like assigning a
              writing assistant to every pull request.
            </h4>
          </div>
          <div className="grid gap-4 lg:items-center xl:grid-cols-4 lg:grid-cols-2">
            <Card
              description="Floe analyzes your codebase, diffs and commits to ensure every change is captured."
              icon={DocumentMagnifyingGlassIcon}
              title="Your content, in context"
            />
            <Card
              description="Integrate with CI to automatically create new files and update existing ones."
              icon={ArrowPathIcon}
              title="Write, update, automate"
            />
            <Card
              description="Floe's AI-powered linter allows you to specify rules for anything, from tone to company vernacular."
              icon={DocumentCheckIcon}
              title="Prose linting, supercharged"
            />
            <Card
              description="Floe ships with best practice templates and style guides based on the Good Docs Project."
              icon={DocumentDuplicateIcon}
              title="Consistent by design"
            />
          </div>
        </section>
        <section className="my-20 sm:my-40">
          <BetaCard />
        </section>
      </div>
    </div>
  );
}
