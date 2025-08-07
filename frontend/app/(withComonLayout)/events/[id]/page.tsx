import { getEventById } from "@/lib/api";
import { CalendarDays, Clock, Ticket, Users } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCalendar from "./AddToCalendar";
import BookingPage from "./BookingPage";
import CountdownTimer from "./CountdownTimer";
import ShareQRCode from "./ShareQRCode";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
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

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);
  if (!event) return notFound();

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-32 py-30 space-y-12">
        {/* Event Image */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <Image
            src={event.image}
            alt={event.title}
            width={1200}
            height={600}
            className="w-full h-[350px] object-cover"
            priority
          />
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {event.title}
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
          <div className="flex items-start space-x-3">
            <CalendarDays className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <p className="font-medium text-white">Starts</p>
              <p>{new Date(event.startsAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <p className="font-medium text-white">Ends</p>
              <p>{new Date(event.endsAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <p className="font-medium text-white">Total Slots</p>
              <p>{event.totalSlots}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Ticket className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <p className="font-medium text-white">Queue Type</p>
              <p>{event.queueType}</p>
            </div>
          </div>
        </div>

        {/* Action Tools */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex justify-center items-center">
              <AddToCalendar event={event} />
            </div>

            <div className="flex justify-center items-center">
              <ShareQRCode
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/events/${event._id}`}
              />
            </div>

            <div className="flex justify-center items-center">
              <CountdownTimer endsAt={event.endsAt} />
            </div>

            <div className="flex justify-center items-center">
              <BookingPage
                eventId={event._id}
                eventTitle={event.title}
                eventEndsAt={event.endsAt}
                totalSlots={event.totalSlots}
                queueType={event.queueType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
