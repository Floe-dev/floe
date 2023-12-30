import { db } from "@floe/db";
import { Button, Pill } from "@floe/ui";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
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

export default async function Settings({
  params,
}: {
  params: { workspace: string };
}) {
  const freeTierFeature = [
    "25k GPT-4 Turbo tokens / month",
    "Unlimited GPT-3.5 Turbo tokens",
  ];

  const proTierFeature = [
    "1M GPT-4 Turbo tokens / month",
    "Unlimited GPT-3.5 Turbo tokens",
    "Priority support",
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

  return (
    <div>
      <div className="prose prose-zinc">
        <h2 className="mb-2">Billing</h2>
        <p>Manage your subscription.</p>
      </div>
      <div className="mt-10">
        <p>
          You are currently on the{" "}
          <Pill
            color="black"
            text={workspaceWithSubscription?.subscription ? "Pro" : "Free"}
          />{" "}
          tier.
        </p>
      </div>
      <div className="flow-root mt-6">
        <div className="grid grid-cols-1 py-8 bg-white divide-y shadow rounded-xl divide-zinc-200 isolate gap-y-16 sm:mx-auto lg:max-w-none lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          {/* Free tier */}
          <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
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
            {workspaceWithSubscription?.subscription ? (
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
              <Button className="w-full px-3 py-2 mt-6" disabled>
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
          <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
            <h3 className="text-base font-semibold leading-7 text-zinc-900">
              Pro
            </h3>
            <p className="flex items-baseline mt-6 gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-zinc-900">
                $490
              </span>
              <span className="text-sm font-semibold leading-6 text-zinc-600">
                /month
              </span>
            </p>
            {/* <p className="mt-3 text-sm leading-6 text-zinc-500">
              {tier.price.annually} per month if paid annually
            </p> */}
            {workspaceWithSubscription?.subscription ? (
              <Button className="w-full px-3 py-2 mt-6" disabled>
                Current plan
              </Button>
            ) : (
              <form action={createStripeCheckoutSessionWithSlug} method="POST">
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
        </div>
      </div>
    </div>
  );
}
