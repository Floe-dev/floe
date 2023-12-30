import Stripe from "stripe";
import { db } from "@floe/db";
import { env } from "~/env.mjs";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const toDateTime = (secs: number) => {
  const t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const createOrRetrieveCustomer = async ({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) => {
  const workspace = await db.workspace.findUnique({
    where: { slug: workspaceSlug },
    include: {
      members: {
        where: { role: "OWNER" },
        include: {
          user: true,
        },
      },
    },
  });

  if (!workspace) {
    throw new Error("Could not find Workspace by Slug");
  }

  // No customer record found, let's create one.
  if (!workspace.stripeCustomerId) {
    const customerData = {
      metadata: {
        floeWorkspaceSlug: workspaceSlug,
        floeWorkspaceContactName: workspace.members[0].user.name,
        floeWorkspaceContactEmail: workspace.members[0].user.email,
      },
    };

    // Create a new customer object in Stripe.
    const customer = await stripe.customers.create(customerData);

    // Now insert the customer ID into our Supabase mapping table.
    await db.workspace.update({
      where: { slug: workspaceSlug },
      data: { stripeCustomerId: customer.id },
    });
    console.log(`New customer created and inserted for ${workspaceSlug}.`);
    return customer.id;
  }

  return workspace.stripeCustomerId;
};

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    stripeProductId: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images[0] ?? null,
    metadata: product.metadata,
  };

  return db.product.upsert({
    where: { stripeProductId: product.id },
    create: productData,
    update: productData,
  });
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData = {
    stripePriceId: price.id,
    productId: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    pricingType: price.type,
    unitAmount: price.unit_amount ?? null,
    pricingPlanInterval: price.recurring?.interval ?? null,
    intervalCount: price.recurring?.interval_count ?? null,
    trialPeriodDays: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  return db.price.upsert({
    where: { stripePriceId: price.id },
    create: priceData,
    update: priceData,
  });
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  stripeCustomerId: string
) => {
  const workspace = await db.workspace.findUnique({
    where: { stripeCustomerId },
  });

  if (!workspace) {
    throw new Error("Could not find Workspace by Stripe Customer ID");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const subscriptionData = {
    stripeSubscriptionId: subscriptionId,
    workspaceId: workspace.id,
    priceId: subscription.items.data[0].price.id,
    // @ts-expect-error -- This exists
    quantity: subscription.quantity,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceledAt: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    currentPeriodStart: toDateTime(subscription.current_period_start),
    currentPeriodEnd: toDateTime(subscription.current_period_end),
    endedAt: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trialStart: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trialEnd: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null,
  };

  return db.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionId },
    create: subscriptionData,
    update: subscriptionData,
  });
};

export const deleteSubscription = async (
  subscriptionId: string,
  stripeCustomerId: string
) => {
  return db.subscription.delete({
    where: {
      stripeSubscriptionId: subscriptionId,
      workspace: {
        stripeCustomerId,
      },
    },
  });
};
