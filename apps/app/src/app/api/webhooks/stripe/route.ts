import type { NextRequest } from "next/server";
import { stripe } from "~/lib/stripe";
import { env } from "~/env.mjs";

const handler = async (req: NextRequest) => {
  const payload = await req.text();
  const stripeSignature = req.headers.get("stripe-signature");

  if (!stripeSignature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    stripeSignature,
    env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(session);
      // Handle saving subscription details

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export { handler as POST };
