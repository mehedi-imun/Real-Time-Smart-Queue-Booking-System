// app/events/[id]/booking/page.tsx
// import BookingPage from "@/components/BookingPage";
import { getEventById } from "@/lib/api";
import { notFound } from "next/navigation";
import BookingPage from "./BookingPage";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function BookingPageWrapper({ params }: Props) {
  const event = await getEventById(params.id);
  if (!event) return notFound();
console.log(event)
  return (
    <BookingPage
      eventId={event._id}
      eventTitle={event.title}
      eventEndsAt={event.endsAt}
      totalSlots={event.totalSlots}
      queueType={event.queueType}
    />
  );
}
