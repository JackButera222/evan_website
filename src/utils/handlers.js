export async function handleBookingSubmit(event, setBookingSent) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const shootType = formData.get("shootType")?.toString().trim() ?? "";
  const budget = formData.get("budget")?.toString().trim() ?? "";
  const instagram = formData.get("instagram")?.toString().trim() ?? "";

  // Shared event id so Meta dedupes the browser pixel Lead against the
  // server-side Conversions API Lead.
  const eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.fbq?.("track", "Lead", {}, { eventID: eventId });

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, shootType, budget, instagram, eventId }),
    });
    if (!res.ok) throw new Error(`send failed: ${res.status}`);
    form.reset();
    setBookingSent(true);
  } catch {
    // Fallback: open the visitor's mail client with a pre-filled draft so
    // the lead isn't lost if the API is down (or in local dev, where the
    // serverless function isn't running).
    const subject = encodeURIComponent("TripodVawn Booking Request");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nType of Shoot: ${shootType}\nBudget: ${budget}\nInstagram: ${instagram}`,
    );
    window.location.href = `mailto:tripodvawn@gmail.com?subject=${subject}&body=${body}`;
    setBookingSent(true);
  }
}
