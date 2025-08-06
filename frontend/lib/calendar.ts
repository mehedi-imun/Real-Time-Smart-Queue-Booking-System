export function addToCalendar({
  title,
  description,
  start,
  end,
  location = "",
}: {
  title: string;
  description: string;
  start: string;
  end: string;
  location?: string;
}) {
  const startDate = formatDate(start);
  const endDate = formatDate(end);

  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("dates", `${startDate}/${endDate}`);
  url.searchParams.set("details", description);
  url.searchParams.set("location", location);

  window.open(url.toString(), "_blank");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
