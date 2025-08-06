import Hero from "@/components/home/Hero";
import Image from "next/image";
import Link from "next/link";

type EventType = {
  _id: string;
  title: string;
  image?: string;
  startsAt: string;
  endsAt: string;
  queueType: "FIFO" | "PRIORITY";
};

async function getEvents(): Promise<EventType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/event`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  return data.data;
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Gradient Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.2), transparent 70%)",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-32 py-20">
        {/* Hero Section */}
        <Hero />

        {/* Heading */}
        <h1 className="text-white font-extrabold text-center mt-16 mb-10 text-2xl md:text-3xl lg:text-4xl">
          📅 Upcoming Queue Events
        </h1>

        {/* Event Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event._id} href={`/events/${event._id}`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
                <Image
                  src={event.image || "/default-event-image.jpg"}
                  alt={event.title}
                  width={600}
                  height={200}
                  className="w-full h-44 md:h-48 lg:h-52 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Starts: {new Date(event.startsAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Ends: {new Date(event.endsAt).toLocaleString()}
                  </p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {event.queueType}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Events Message */}
        {events.length === 0 && (
          <p className="text-center text-gray-400 mt-20 text-lg">
            No upcoming events found.
          </p>
        )}
      </div>
    </div>
  );
}
