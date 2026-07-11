import { createHash } from "node:crypto";

const PIXEL_ID = "2198785054307101";

// Vercel serverless function: receives the booking form, emails it to Evan
// via Resend, and (when META_CAPI_TOKEN is set) mirrors the Lead event to
// Meta's Conversions API with a hashed email for better ad attribution.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, shootType, budget, instagram, eventId } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Type of Shoot: ${shootType ?? ""}`,
    `Budget: ${budget ?? ""}`,
    `Instagram: ${instagram ?? ""}`,
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "TripodVawn Site <onboarding@resend.dev>",
      to: ["tripodvawn@gmail.com"],
      reply_to: email,
      subject: `Booking request from ${name}`,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();
    console.error("Resend error:", detail);
    return res.status(502).json({ error: "Email send failed" });
  }

  // Server-side Lead event, deduplicated against the browser pixel via
  // eventId. Best-effort: a CAPI hiccup must never fail the form.
  if (process.env.META_CAPI_TOKEN) {
    try {
      await fetch(
        `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${process.env.META_CAPI_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [
              {
                event_name: "Lead",
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                action_source: "website",
                user_data: {
                  em: [
                    createHash("sha256")
                      .update(email.trim().toLowerCase())
                      .digest("hex"),
                  ],
                  client_ip_address:
                    req.headers["x-forwarded-for"]?.split(",")[0],
                  client_user_agent: req.headers["user-agent"],
                },
              },
            ],
          }),
        },
      );
    } catch (err) {
      console.error("Meta CAPI error:", err);
    }
  }

  return res.status(200).json({ ok: true });
}
