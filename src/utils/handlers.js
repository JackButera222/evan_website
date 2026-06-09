export function handleBookingSubmit(event, setBookingSent) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const shootType = formData.get("shootType")?.toString().trim() ?? "";
  const budget = formData.get("budget")?.toString().trim() ?? "";
  const instagram = formData.get("instagram")?.toString().trim() ?? "";

  const subject = encodeURIComponent("TripodVawn Booking Request");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nType of Shoot: ${shootType}\nBudget: ${budget}\nInstagram: ${instagram}`,
  );

  window.location.href =
    `mailto:tripodvawn@gmail.com?subject=${subject}&body=${body}`;
  setBookingSent(true);
}
