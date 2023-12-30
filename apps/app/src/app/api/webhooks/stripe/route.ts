import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "~/lib/stripe";
import { env } from "~/env.mjs";

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

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(session);
      // Handle saving subscription details

      break;
    case "customer.subscription.deleted":
      const subscription = event.data.object;
      console.log(subscription);
      // Handle removing subscription details

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }));
};

export { handler as POST };
