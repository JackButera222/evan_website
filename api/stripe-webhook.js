import { createHmac, timingSafeEqual } from "node:crypto";

// Vercel serverless function: Stripe calls this when a Checkout Session
// completes. We verify the signature ourselves (no `stripe` npm dependency —
// same lightweight, fetch-based approach as the rest of /api) and email the
// buyer their Dropbox access link via Resend.
//
// Env vars (set in Vercel project settings):
//   STRIPE_SECRET_KEY       required — reused from create-checkout-session.js
//   STRIPE_WEBHOOK_SECRET   required — whsec_... from the Stripe Dashboard
//                            webhook endpoint you point at this URL
//   RESEND_API_KEY          required — reused from api/contact.js
//   CONTACT_FROM_EMAIL      optional — reused from api/contact.js
//   IAC_PACK_DOWNLOAD_URL   optional — overrides the Dropbox link below
export const config = { api: { bodyParser: false } };

const DEFAULT_DOWNLOAD_URL =
  "https://www.dropbox.com/scl/fo/rxkml772g4d4yjkopd193/AO4gJIuLUoRanbaN_oRk8Vs?rlkey=h7b74ppqw5fhbfur2rfse3r5l&st=bu1a7tbs&dl=0";

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Verifies Stripe's "Stripe-Signature" header ourselves: it's
// `t=<timestamp>,v1=<hex hmac>`, and the signed payload is `${t}.${rawBody}`.
function isValidStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
  if (!parts.t || !parts.v1) return false;

  // Reject stale events (protects against replay of a leaked payload).
  const age = Date.now() / 1000 - Number(parts.t);
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(parts.v1, "hex");
  return expectedBuf.length === actualBuf.length && timingSafeEqual(expectedBuf, actualBuf);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return res.status(500).json({ error: "Not configured" });
  }

  const rawBody = await getRawBody(req);
  const valid = isValidStripeSignature(
    rawBody.toString("utf8"),
    req.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  if (!valid) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody.toString("utf8"));

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email;
    if (email) {
      const downloadUrl = process.env.IAC_PACK_DOWNLOAD_URL ?? DEFAULT_DOWNLOAD_URL;
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "TripodVawn <onboarding@resend.dev>",
          to: [email],
          subject: "Your Independent Artist Content Pack",
          text: [
            "Thanks for grabbing the Independent Artist Content Pack!",
            "",
            `Here's your access link (lifetime access, save it somewhere safe):`,
            downloadUrl,
            "",
            "Questions? Just reply to this email.",
          ].join("\n"),
        }),
      });

      if (!resendResponse.ok) {
        console.error("Resend error:", await resendResponse.text());
        // Don't fail the webhook over an email hiccup — Stripe would retry
        // and re-charge nothing, but we'd rather investigate manually than
        // risk duplicate emails from repeated retries.
      }
    }
  }

  return res.status(200).json({ received: true });
}
