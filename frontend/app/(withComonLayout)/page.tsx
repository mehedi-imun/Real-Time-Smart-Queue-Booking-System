import Link from "next/link";
import Image from "next/image";

type EventType = {
  _id: string;
  title: string;
  image?: string;
  startsAt: string;
  endsAt: string;
  queueType: "FIFO" | "PRIORITY";
};

async function getEvents(): Promise<EventType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/event`, {
    cache: "no-store", // disable caching for real-time data
  });

  // if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  console.log(data)
  return data.data;
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-gray-100 mt-28 py-10 px-4 md:px-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📅 Upcoming Queue Events
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link key={event._id} href={`/events/${event._id}`}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <Image
                  src={event.image || "/default-event-image.jpg"}
                  alt={event.title}
                  width={600}
                  height={192}
                  className="w-full h-48 object-cover"
                  style={{ objectFit: "cover" }}
                />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-500 text-sm mb-1">
                  Starts: {new Date(event.startsAt).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Ends: {new Date(event.endsAt).toLocaleString()}
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                  {event.queueType}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No upcoming events found.
        </p>
      )}
    </main>
  );
}
