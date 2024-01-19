import { db } from "@floe/db";
import { Button, Pill } from "@floe/ui";
import { price } from "@floe/db/models";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Header } from "~/app/_components/header";
import { env } from "~/env.mjs";
import { createStripeCheckoutSession, createPortalLink } from "./actions";

async function getWorkspaceWithSubscription(slug: string) {
  const workspace = await db.workspace.findUnique({
    where: {
      slug,
    },
    include: {
      subscription: {
        include: {
          price: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return workspace;
}

export default async function Billing({
  params,
}: {
  params: { workspace: string };
}) {
  const proPrice = await price.findOne(env.STRIPE_PRO_PRICE_ID, {
    product: true,
  });
  const freeTierFeature = ["Unlimited GPT-3.5 Turbo tokens", "Rate limited"];

  const proTierFeature = [
    "Unlimited GPT-4 Turbo tokens",
    "Priority support",
    "Teams (Coming soon)",
  ];

  const workspaceWithSubscription = await getWorkspaceWithSubscription(
    params.workspace
  );
  const createPortalLinkWithSlug = createPortalLink.bind(
    null,
    params.workspace
  );
  const createStripeCheckoutSessionWithSlug = createStripeCheckoutSession.bind(
    null,
    params.workspace
  );

  const hasSubscription = workspaceWithSubscription?.subscription;
  const willBeCanceled =
    workspaceWithSubscription?.subscription?.cancelAtPeriodEnd;

  return (
    <div className="max-w-screen-lg">
      <Header description="Manage your subscription." title="Billing" />
      <div className="prose prose-zinc">
        {/* <p>
          You are currently on the{" "}
          <Pill color="black" text={hasSubscription ? "Pro" : "Free"} /> tier.
        </p> */}
        <p>
          You are on the <Pill color="black" text="Beta" /> tier.
        </p>
        <p>
          Following the Floe Beta this plan will be downgraded to the Free tier.
        </p>
      </div>
      <div className="flow-root mt-6">
        <div className="grid grid-cols-1 py-8 bg-white divide-y shadow rounded-xl divide-zinc-200 isolate gap-y-16 sm:mx-auto lg:max-w-none lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* Free tier */}
          <div className="px-8 xl:px-14">
            <h3 className="text-base font-semibold leading-7 text-zinc-900">
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
            {willBeCanceled ? (
              <Button className="w-full px-3 py-2 mt-6" color="gray" disabled>
                Starting on{" "}
                {workspaceWithSubscription.subscription?.cancelAt?.toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Button>
            ) : hasSubscription ? (
              <form action={createPortalLinkWithSlug} method="POST">
                <Button
                  className="w-full px-3 py-2 mt-6"
                  color="gray"
                  type="submit"
                >
                  Downgrade
                </Button>
              </form>
            ) : (
              <Button className="w-full px-3 py-2 mt-6" color="gray" disabled>
                Current plan
              </Button>
            )}

            <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
              Everything necessary to get started.
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

          {/* Pro tier */}
          {proPrice?.active && proPrice.unitAmount ? (
            <div className="px-8 pt-16 lg:pt-0 xl:px-14">
              <h3 className="text-base font-semibold leading-7 text-zinc-900">
                {proPrice.product.name}
              </h3>
              <p className="flex items-baseline mt-6 gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-900">
                  ${proPrice.unitAmount / 100}
                </span>
                <span className="text-sm font-semibold leading-6 text-zinc-600">
                  /month ({proPrice.currency.toUpperCase()})
                </span>
              </p>
              {/* <p className="mt-3 text-sm leading-6 text-zinc-500">
              {tier.price.annually} per month if paid annually
            </p> */}
              {willBeCanceled ? (
                <form action={createPortalLinkWithSlug} method="POST">
                  <Button className="w-full px-3 py-2 mt-6" type="submit">
                    Renew
                  </Button>
                </form>
              ) : hasSubscription ? (
                <Button className="w-full px-3 py-2 mt-6" disabled>
                  Current plan
                </Button>
              ) : (
                <form
                  action={createStripeCheckoutSessionWithSlug}
                  method="POST"
                >
                  <Button className="w-full px-3 py-2 mt-6" type="submit">
                    Buy plan
                  </Button>
                </form>
              )}
              <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
                Features for professionals and teams.
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
