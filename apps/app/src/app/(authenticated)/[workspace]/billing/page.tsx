import { db } from "@floe/db";
import { Button, Pill } from "@floe/ui";
import { price } from "@floe/db/models";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
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
  const workspaceWithSubscription = await getWorkspaceWithSubscription(
    params.workspace
  );
  const proPrice = await price.findOne(env.STRIPE_PRO_PRICE_ID, {
    product: true,
  });
  const customPrice = workspaceWithSubscription?.availableCustomPriceId
    ? await price.findOne(workspaceWithSubscription.availableCustomPriceId, {
        product: true,
      })
    : null;
  const freeTierFeature = [
    "25K Pro tokens",
    "1M Basic tokens",
    "Slack support",
  ];

  const proTierFeature = [
    `2M Pro tokens`,
    "Unlimited Basic tokens",
    "Priority support",
    "Higher rate limits",
  ];

  const customTierFeature = [
    "BYOK (Bring your own key)",
    "Unlimited Pro tokens",
    "Dedicated support channel",
    "Highest rate limits",
  ];

  const createPortalLinkWithSlug = createPortalLink.bind(
    null,
    params.workspace
  );
  const createStripeCheckoutSessionWithSlug = createStripeCheckoutSession.bind(
    null,
    params.workspace
  );
  const proCheckoutSession = createStripeCheckoutSessionWithSlug.bind(
    null,
    env.STRIPE_PRO_PRICE_ID
  );
  const customCheckoutSession = createStripeCheckoutSessionWithSlug.bind(
    null,
    workspaceWithSubscription?.availableCustomPriceId
  );
  const hasSubscription = workspaceWithSubscription?.subscription;
  const hasProSubscription =
    workspaceWithSubscription?.subscription?.priceId ===
    env.STRIPE_PRO_PRICE_ID;
  const hasCustomSubscription = hasSubscription && !hasProSubscription;
  const willBeCanceled =
    workspaceWithSubscription?.subscription?.cancelAtPeriodEnd;

  return (
    <div className="max-w-screen-lg">
      <Header description="Manage your subscription." title="Billing" />
      <div className="prose prose-zinc">
        <p>
          You are currently on the{" "}
          <Pill
            color="black"
            text={
              hasProSubscription && proPrice
                ? proPrice.product.name
                : hasCustomSubscription && customPrice
                ? customPrice.product.name
                : "Free"
            }
          />{" "}
          tier.
        </p>
      </div>
      <div className="flow-root mt-6">
        <div className="grid grid-cols-1 py-8 bg-white divide-y shadow rounded-xl divide-zinc-200 isolate gap-y-16 sm:mx-auto lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {/* Free tier */}
          <div className="px-8 xl:px-14">
            <h3 className="flex items-center gap-2 text-base font-semibold leading-7 text-zinc-900">
              Free
              {hasSubscription ? null : <Pill color="black" text="Active" />}
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
              <h3 className="flex items-center gap-2 text-base font-semibold leading-7 text-zinc-900">
                {proPrice.product.name}
                {hasProSubscription ? (
                  <Pill color="black" text="Active" />
                ) : null}
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
              {hasProSubscription && willBeCanceled ? (
                <form action={createPortalLinkWithSlug} method="POST">
                  <Button className="w-full px-3 py-2 mt-6" type="submit">
                    Renew
                  </Button>
                </form>
              ) : hasProSubscription ? (
                <Button className="w-full px-3 py-2 mt-6" disabled>
                  Current plan
                </Button>
              ) : (
                <form action={proCheckoutSession} method="POST">
                  <Button
                    className="w-full px-3 py-2 mt-6"
                    disabled={Boolean(hasCustomSubscription)}
                    type="submit"
                  >
                    Buy plan
                  </Button>
                </form>
              )}
              <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
                Features for professionals and small teams.
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

          {/* Custom tier */}
          <div className="px-8 pt-16 lg:pt-0 xl:px-14">
            <h3 className="flex items-center gap-2 text-base font-semibold leading-7 text-zinc-900">
              {customPrice ? customPrice.product.name : "Business"}
              {hasCustomSubscription ? (
                <Pill color="black" text="Active" />
              ) : null}
            </h3>
            <p className="flex items-baseline mt-6 gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-zinc-900">
                {customPrice?.unitAmount
                  ? customPrice.unitAmount / 100
                  : "Custom"}
              </span>
              {customPrice ? (
                <span className="text-sm font-semibold leading-6 text-zinc-600">
                  /month ({customPrice.currency.toUpperCase()})
                </span>
              ) : null}
            </p>
            {hasCustomSubscription && willBeCanceled ? (
              <form action={createPortalLinkWithSlug} method="POST">
                <Button className="w-full px-3 py-2 mt-6" type="submit">
                  Renew
                </Button>
              </form>
            ) : hasCustomSubscription ? (
              <Button className="w-full px-3 py-2 mt-6" disabled>
                Current plan
              </Button>
            ) : customPrice ? (
              <form action={customCheckoutSession} method="POST">
                <Button
                  className="w-full px-3 py-2 mt-6"
                  disabled={Boolean(hasProSubscription)}
                  type="submit"
                >
                  Buy plan
                </Button>
              </form>
            ) : (
              <Link href="https://cal.com/nic-haley/30min">
                <Button className="w-full px-3 py-2 mt-6" color="secondary">
                  Let&apos;s talk
                </Button>
              </Link>
            )}
            <p className="mt-10 text-sm font-semibold leading-6 text-zinc-900">
              Features for large teams and enterprises.
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
  );
}
