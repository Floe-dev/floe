import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "~/lib/stripe";
import { env } from "~/env.mjs";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

/**
 * This handler is based on https://github.com/vercel/nextjs-subscription-payments/tree/main
 */
const handler = async (req: NextRequest) => {
  const payload = await req.text();
  const stripeSignature = req.headers.get("stripe-signature");
  let event: Stripe.Event;

  if (!stripeSignature) {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.log(`❌ Error message: ${e.message}`);
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      );
    }
  }

  return new Response(JSON.stringify({ received: true }));
};

export { handler as POST };
