import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Link } from "nextra-theme-docs";
import { Button } from "nextra/components";

const freeTierFeature = ["25K Pro tokens", "250 Basic tokens", "Slack support"];

const proTierFeature = [
  `1M Pro tokens`,
  "2M Basic tokens",
  "Priority support",
  "Higher rate limits",
];

const customTierFeature = [
  "Option to bring your own OpenAI key",
  "Custom token limits",
  "White-glove onboarding support",
  "Dedicated support channel",
  "Highest rate limits",
];

export function Pricing() {
  return (
    <div className="relative overflow-x-hidden bg-white isolate bg-noise after:bg-gradient-to-b after:from-white after:opacity-50 after:-z-30 after:absolute after:inset-0">
      <div className="px-6 pt-10 mx-auto max-w-7xl sm:pt-20 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-4xl sm:text-5xl font-garamond">Pricing</h2>
          <h4 className="text-lg sm:text-xl text-zinc-600">
            Get started with Floe for free.
            <br />
            Upgrade to get access to more tokens and better rate limits.
          </h4>
        </div>
        <div className="flow-root my-20">
          <div className="grid grid-cols-1 py-8 bg-white divide-y shadow rounded-xl divide-zinc-200 isolate gap-y-16 sm:mx-auto lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {/* Free tier */}
            <div className="px-8 xl:px-14">
              <h3 className="flex items-center gap-2 text-base font-semibold leading-7 text-zinc-900">
                Free
              </h3>
              <p className="flex items-baseline mt-6 gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-900">
                  $0
                </span>
                <span className="text-sm font-semibold leading-6 text-zinc-600">
                  /month
                </span>
              </p>

              <Button className="w-full px-3 py-2 mt-6" color="gray" disabled>
                Get started
              </Button>

              <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
                Everything necessary to get started. No credit card required.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-zinc-600">
                {freeTierFeature.map((feature) => (
                  <li className="flex gap-x-3" key={feature}>
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="flex-none w-5 h-6 text-amber-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-8 pt-16 lg:pt-0 xl:px-14">
              <h3 className="flex items-center gap-2 text-base font-semibold leading-7 text-zinc-900">
                Pro
              </h3>
              <p className="flex items-baseline mt-6 gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-900">
                  $99
                </span>
                <span className="text-sm font-semibold leading-6 text-zinc-600">
                  /month (USD)
                </span>
              </p>

              <Button className="w-full px-3 py-2 mt-6">Get started</Button>

              <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
                For professionals and small teams.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-zinc-600">
                {proTierFeature.map((feature) => (
                  <li className="flex gap-x-3" key={feature}>
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="flex-none w-5 h-6 text-amber-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom tier */}
            <div className="px-8 pt-16 lg:pt-0 xl:px-14">
              <h3 className="flex items-center gap-2 text-base font-semibold leading-7 text-zinc-900">
                Team
              </h3>
              <p className="flex items-baseline mt-6 gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-900">
                  Custom
                </span>
              </p>

              <Link href="https://cal.com/nic-haley/30min">
                <Button className="w-full px-3 py-2 mt-6" color="secondary">
                  Let&apos;s talk
                </Button>
              </Link>
              <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
                For large teams and enterprises.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-zinc-600">
                {customTierFeature.map((feature) => (
                  <li className="flex gap-x-3" key={feature}>
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="flex-none w-5 h-6 text-amber-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
