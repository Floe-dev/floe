export default function Settings() {
  return (
    <div>
      <div className="prose prose-zinc">
        <h2 className="mb-2">Settings</h2>
        <p>Manage your billing.</p>
        <h3>Billing</h3>
        <form action="/create-checkout-session" method="POST">
          <input name="priceId" type="hidden" value="price_G0FvDp6vZvdwRZ" />
          <button type="submit">Checkout</button>
        </form>
      </div>
    </div>
  );
}
