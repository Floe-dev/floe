import { stripe } from "~/lib/stripe";
import { env } from "~/env.mjs";

const url =
  env.NODE_ENV === "production" ? env.VERCEL_URL : "http://localhost:3001";

export default function Settings({
  params,
}: {
  params: { workspace: string };
}) {
  async function createStripeCheckoutSession() {
    "use server";

    console.log(1111);

    const r = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${url}/${params.workspace}/settings?success=true`,
      cancel_url: `${url}/${params.workspace}/settings?canceled=true`,
    });

    console.log(2222, r);
  }

  return (
    <div>
      <div className="prose prose-zinc">
        <h2 className="mb-2">Settings</h2>
        <p>Manage your billing.</p>
        <h3>Billing</h3>
        <form action={createStripeCheckoutSession} method="POST">
          <button type="submit">Checkout</button>
        </form>
      </div>
    </div>
  );
}
