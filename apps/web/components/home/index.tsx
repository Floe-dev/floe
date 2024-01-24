import Link from "next/link";
import Image from "next/image";
import { Button, Pill, Accordion } from "@floe/ui";
import PencilArt from "public/pencil-art.png";
import { StarIcon } from "@heroicons/react/24/solid";
import { Blob } from "./blob";
import { Title } from "./title";
import { FeatureCard } from "./feature-card";
import { Carousel } from "./carousel";

export default function Home(): JSX.Element {
  return (
    <div className="relative overflow-x-hidden bg-white isolate bg-noise after:bg-gradient-to-b after:from-white after:opacity-50 after:-z-30 after:absolute after:inset-0">
      <div className="px-6 pt-10 mx-auto max-w-7xl sm:pt-20 lg:px-8">
        <section className="lg:flex lg:items-center lg:gap-x-10">
          <div className="flex flex-col max-w-2xl mx-auto lg:mx-0 lg:flex-auto">
            <span className="flex-grow-0">
              <Pill text="Early access" />
            </span>
            <Title />
            <p className="mt-4 mb-10 text-xl leading-8 sm:text-2xl sm:mt-6 sm:mb-10 text-zinc-600">
              Meet your new AI-powered writing assistant. Floe is the CICD
              platform for writing better docs without the headache.
            </p>
            <div className="flex justify-center gap-4 sm:justify-start">
              <Link
                className="flex items-center gap-x-1"
                href="https://app.floe.dev"
                target="_blank"
              >
                <Button size="xl">Get started</Button>
              </Link>
              <Link href="https://github.com/Floe-dev/floe">
                <Button color="secondary" size="xl" variant="text">
                  <StarIcon className="w-5 h-5" /> Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <Blob />
          </div>
        </section>
        <section className="my-10 mb-20 sm:my-20">
          <div className="m-auto sm:w-5/6">
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
          <div className="flex flex-col gap-8 md:flex-row">
            <FeatureCard
              color="amber"
              description="Write your own rules. \nFind and fix issues linters can't."
              pillText="Now available"
              title="Reviews"
            >
              <div className="p-1 rounded-lg bg-white/60">
                <div className="overflow-hidden font-mono rounded-lg shadow-lg bg-black/70">
                  <div className="px-4 py-2 text-xs text-left text-amber-50 bg-black/60">
                    .floe/rules/style-guide.md
                  </div>
                  <div className="p-4 text-sm text-left text-white text">
                    - Use the Oxford comma
                    <br />
                    - Use inclusive language. Use &apos;they&apos; instead of
                    &apos;he&apos; or &apos;she&apos;
                    <br />
                  </div>
                </div>
                <div className="p-4 font-mono text-sm text-left ">
                  <div className="flex">
                    <span className="px-4 mr-2 font-semibold text-white bg-yellow-600">
                      WARN
                    </span>
                    📂 docs/prerequisites.mdx
                  </div>
                  <br />
                  <div className="my-1 font-semibold">style-guide @@8,8:</div>
                  <div className="italic">
                    The Oxford comma is missing before &apos;and&apos; in a list
                    of items.
                  </div>
                  <div className="text-zinc-500">
                    ➖ macOS, Windows and Linux are supported.
                  </div>
                  <div className="">
                    ➕ macOS, Windows<span className="text-green-600">,</span>{" "}
                    and Linux are supported.
                  </div>
                  <br />
                  <div className="my-1 font-semibold">style-guide @@20,20:</div>
                  <div className="italic">
                    The word &apos;he&apos; is not inclusive.
                  </div>
                  <div className="text-zinc-500">
                    ➖ <span className="text-red-600">He</span> can then install
                    the package.
                  </div>
                  <div className="">
                    ➕ <span className="text-green-600">They</span> can then
                    install the package.
                  </div>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard
              color="rose"
              description="Write content, consistently. \nGenerate your first draft in seconds."
              pillText="Coming soon"
              title="First Draft"
            >
              <div className="p-1 rounded-lg bg-white/60">
                <div className="overflow-hidden font-mono rounded-lg shadow-lg bg-black/70">
                  <div className="px-4 py-2 text-xs text-left text-amber-50 bg-black/60">
                    .floe/templates/changelog.md
                  </div>
                  <div className="p-4 text-sm text-left text-white text">
                    # &#123;&#123;ai &quot;Write a short and simple
                    title.&quot;&#125;&#125; <br />
                    ## &#123;&#123;env.DATE&#125;&#125;
                    <br />
                    <br />
                    &#123;&#123;ai &quot;Announce the major change. Don&apos;t
                    use technical jargon. Your tone should be casual, but
                    professional.&quot;&#125;&#125;
                  </div>
                </div>
                <div className="p-4 text-left">
                  <div className="text-xl font-semibold">First Draft</div>
                  <div className="text-lg text-znc-500">January 24, 2024</div>
                  <div className="mt-2 text-md text-zinc-700">
                    Today we&apos;re releasing First Draft. Create templates for
                    a variety of use-cases: changelogs, release notes, API
                    references, etc. When you create a PR, First Draft will
                    automatically populate the template using contextual
                    information and AI.
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>
        </section>
        <section className="my-20 sm:my-40">
          <div className="mb-10 text-center ">
            <h2 className="mb-4 text-4xl sm:text-5xl font-garamond">Install</h2>
            <h4 className="text-lg sm:text-xl text-zinc-600">
              Get started in 5 minutes or less.
            </h4>
          </div>
          <div className="sm:max-w-[560px] p-6 -mx-6 font-mono text-left rounded-none shadow-lg sm:rounded-lg sm:mx-auto text-md text-zinc-50 bg-zinc-950/80">
            <span className="text-green-500">npm</span> i -g @floe/cli@latest
            <br />
            <span className="text-green-500">floe</span> init
            <br />
            <div className="text-zinc-500"># Add environment variables ...</div>
            <span className="text-green-500">floe</span> review files
          </div>
        </section>
        <section className="my-20 sm:my-40">
          <div className="mb-10 text-center ">
            <h2 className="mb-4 text-4xl sm:text-5xl font-garamond">FAQ</h2>
          </div>
          <div className="mx-auto sm:w-4/5">
            <Accordion
              className="shadow-lg"
              items={[
                {
                  title: "Do Floe Reviews replace my linter?",
                  content: (
                    <>
                      Floe is not (yet) a linter replacement. It is helpful to
                      think of Floe as more of a writing assistant than a
                      linter. Floe completements your linter by fulfilling tasks
                      that would be difficult to achieve with a linter alone.
                      For example, you can use Floe to:
                      <ul className="mt-4 list-disc list-inside">
                        <li>
                          Quickly write and evaluate rules with a simple
                          interface
                        </li>
                        <li>
                          Write and evaluate rules that would be complicated or
                          impossible to express in a linter
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  title: "How many tokens does it take to perform a review?",
                  content: (
                    <>
                      It depends.
                      <br />
                      <br />
                      Running a review for a 1000 word file with one rule will
                      consume ~2000 tokens. However, when running reviews
                      against diffs you consume far fewer tokens.
                      <br />
                      <br />
                      The number of tokens consumed is always returned in the
                      CLI, and your total monthly usage can be tracked through
                      the dashboard.
                    </>
                  ),
                },
                {
                  title: "Can Floe review my code too?",
                  content: (
                    <>
                      Yes! However, this usecase hasn&apos;t been as widely
                      tested.
                    </>
                  ),
                },
                {
                  title: "Are Floe Reviews deterministic?",
                  content: (
                    <>
                      No.
                      <br />
                      <br />
                      Because Floe Reviews are powered by AI,{" "}
                      <a
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                        href="https://platform.openai.com/docs/guides/text-generation/reproducible-outputs"
                      >
                        they are by default non-deterministic
                      </a>
                      . This means that Floe Reviews may produce different
                      results for the same input. However, a few techniques are
                      used to mitigate this as much as possible:
                      <ul className="my-4 list-disc list-inside">
                        <li>
                          Using a{" "}
                          <a
                            className="text-blue-600 dark:text-blue-500 hover:underline"
                            href="https://platform.openai.com/docs/api-reference/chat/create#chat-create-seed"
                          >
                            seed
                          </a>{" "}
                          value
                        </li>
                        <li>Consistent prompts</li>
                        <li>Caching API responses</li>
                      </ul>
                      In the future,{" "}
                      <a
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                        href="https://platform.openai.com/docs/guides/fine-tuning"
                      >
                        fine-tuning
                      </a>
                      ,{" "}
                      <a
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                        href="https://platform.openai.com/docs/assistants/tools/tools-beta"
                      >
                        assistant tools
                      </a>
                      , and more will be added which should improve consistency.
                    </>
                  ),
                },
                {
                  title: "Which language models do you support?",
                  content: (
                    <>
                      Floe uses OpenAI gpt-1106-preview and gpt-3.5-turbo-1106.
                    </>
                  ),
                },
                {
                  title: "Can I bring my own API key?",
                  content: <>Yes, on a custom Team plan.</>,
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
