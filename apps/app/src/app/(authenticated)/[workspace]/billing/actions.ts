"use server";

import { redirect } from "next/navigation";
import { createOrRetrieveCustomer, stripe } from "~/lib/stripe";
import { url } from "~/utils/url";
import { env } from "~/env.mjs";

export async function createStripeCheckoutSession(slug: string) {
  // Retrieve or create the customer in Stripe
  const customer = await createOrRetrieveCustomer({
    workspaceSlug: slug,
  });

  const result = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer,
    customer_update: {
      address: "auto",
    },
    line_items: [
      {
        price: env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    allow_promotion_codes: true,
    success_url: `${url}/${slug}/billing?success=true`,
    cancel_url: `${url}/${slug}/billing?canceled=true`,
  });

  if (!result.url) {
    throw new Error("No URL returned from Stripe");
  }

  redirect(result.url);
}

export async function createPortalLink(slug: string) {
  const customer = await createOrRetrieveCustomer({
    workspaceSlug: slug,
  });

  const result = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${url}/${slug}/billing`,
  });

  redirect(result.url);
}
