import { db } from "@floe/db";
import { Pill } from "@floe/ui";
import { CheckIcon } from "@heroicons/react/20/solid";
import { createStripeCheckoutSession, createPortalLink } from "./actions";

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
];

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
      {workspaceWithSubscription?.subscription ? (
        <form action={createPortalLinkWithSlug} method="POST">
          <button type="submit">Manage your subscription.</button>
        </form>
      ) : (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-3xl ring-1 ring-zinc-200 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
              Upgrade to Pro
            </h3>
            <p className="mt-6 text-base leading-7 text-zinc-600">
              Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque
              amet indis perferendis blanditiis repellendus etur quidem
              assumenda.
            </p>
            <div className="flex items-center mt-10 gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-amber-600">
                What’s included
              </h4>
              <div className="flex-auto h-px bg-zinc-100" />
            </div>
            <ul className="grid grid-cols-1 gap-4 mt-8 text-sm leading-6 text-zinc-600 sm:grid-cols-2 sm:gap-6">
              {includedFeatures.map((feature) => (
                <li className="flex gap-x-3" key={feature}>
                  <CheckIcon
                    aria-hidden="true"
                    className="flex-none w-5 h-6 text-amber-600"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-2 -mt-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="py-10 text-center rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="max-w-xs px-8 mx-auto">
                <p className="text-base font-semibold text-zinc-600">
                  Pay once, own it forever
                </p>
                <p className="flex items-baseline justify-center mt-6 gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-zinc-900">
                    $349
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-zinc-600">
                    USD
                  </span>
                </p>
                <a
                  className="block w-full px-3 py-2 mt-10 text-sm font-semibold text-center text-white rounded-md shadow-sm bg-amber-600 hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                  href="#"
                >
                  Get access
                </a>
                <p className="mt-6 text-xs leading-5 text-zinc-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <form action={createStripeCheckoutSessionWithSlug} method="POST">
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
}
