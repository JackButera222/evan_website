// Vercel serverless function: looks up a completed Checkout Session so the
// /order-confirmation page can greet the buyer by the email Stripe collected.
// Read-only, and only ever exposes the email — never line items/amounts —
// since the session_id ends up in a shareable URL.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY");
    return res.status(500).json({ error: "Not configured" });
  }

  const { session_id: sessionId } = req.query;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } },
  );
  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    return res.status(404).json({ error: "Session not found" });
  }

  return res.status(200).json({
    paid: session.payment_status === "paid",
    email: session.customer_details?.email ?? null,
  });
}
