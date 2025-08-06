import { getEventById } from "@/lib/api";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCalendar from "./AddToCalendar";
import CountdownTimer from "./CountdownTimer";
import ShareQRCode from "./ShareQRCode";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await getEventById(params.id);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description,
    openGraph: {
      images: [event.image],
    },
  };
}

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <Image
        src={event.image}
        alt={event.title}
        width={1000}
        height={400}
        className="rounded-xl w-full h-[300px] object-cover"
        priority
      />

      <div className="mt-6 space-y-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-lg text-gray-300">{event.description}</p>

        <div className="text-sm text-gray-400 space-y-1">
          <p><strong>Starts:</strong> {new Date(event.startsAt).toLocaleString()}</p>
          <p><strong>Ends:</strong> {new Date(event.endsAt).toLocaleString()}</p>
          <p><strong>Slots:</strong> {event.totalSlots}</p>
          <p><strong>Queue:</strong> {event.queueType}</p>
        </div>

        <CountdownTimer endsAt={event.endsAt} />
        <AddToCalendar event={event} />
        <ShareQRCode url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${event._id}`} />

        <div className="mt-8">
          <a
            href={`/events/${event._id}/book`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
