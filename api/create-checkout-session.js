// Vercel serverless function: creates a Stripe Checkout Session for the IAC
// Pack and returns its hosted URL. The browser redirects to that URL itself
// (see IacPackPage.jsx) rather than us redirecting server-side, so we can
// show a loading state and handle errors inline on the page.
//
// Env vars (set in Vercel project settings):
//   STRIPE_SECRET_KEY     required — sk_live_... / sk_test_...
//   STRIPE_PRICE_AMOUNT   optional — price in cents, defaults to 10000 ($100)
const DEFAULT_AMOUNT_CENTS = 10000;
const PRODUCT_NAME = "Independent Artist Content Pack";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY");
    return res.status(500).json({ error: "Checkout is not configured" });
  }

  const origin = req.headers.origin ?? `https://${req.headers.host}`;
  const amount = Number.parseInt(process.env.STRIPE_PRICE_AMOUNT, 10) || DEFAULT_AMOUNT_CENTS;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/iacpack`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amount));
  params.set("line_items[0][price_data][product_data][name]", PRODUCT_NAME);
  params.set("allow_promotion_codes", "true");

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    console.error("Stripe checkout session error:", session);
    return res.status(502).json({ error: session.error?.message ?? "Checkout failed" });
  }

  return res.status(200).json({ url: session.url });
}
