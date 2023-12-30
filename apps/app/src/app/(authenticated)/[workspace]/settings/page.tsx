import { redirect } from "next/navigation";
import { env } from "~/env.mjs";
import { createOrRetrieveCustomer, stripe } from "~/lib/stripe";

const url =
  env.NODE_ENV === "production" ? env.VERCEL_URL : "http://localhost:3001";

export default function Settings({
  params,
}: {
  params: { workspace: string };
}) {
  async function createStripeCheckoutSession() {
    "use server";

    // Retrieve or create the customer in Stripe
    const customer = await createOrRetrieveCustomer({
      workspaceSlug: params.workspace,
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
      success_url: `${url}/${params.workspace}/settings?success=true`,
      cancel_url: `${url}/${params.workspace}/settings?canceled=true`,
    });

    if (!result.url) {
      throw new Error("No URL returned from Stripe");
    }

    redirect(result.url);
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
