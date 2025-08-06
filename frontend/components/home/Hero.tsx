"use client";

import { cn } from "@/lib/utils";
import image from "@/public/home/ticket.png";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-20 md:pt-[6rem] pb-16 md:pb-[4rem] ">
      <div className="max-w-screen-xl  mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* 📝 Text Section */}
        <div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-white mb-6 leading-snug">
            Smart Queue. <br className="hidden md:block" />
            Real-time Booking.
          </h1>
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-white mb-8 leading-relaxed">
            Book high-demand events and services without the chaos. Join queues
            fairly, securely, and in real-time with a smart, transparent system.
          </p>
          <Link
            href="/events"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 shadow-md"
          >
            Browse Events
          </Link>
        </div>

        {/* 🎟️ Stacked Ticket Images */}
        <div className="relative w-full aspect-[1.618/1] flex items-center justify-center">
          {/* Ticket 3 - Back Layer */}
          <div
            className={cn(
              "absolute w-[20rem] md:w-[33rem] h-[9.5rem] md:h-[15rem] rounded-2xl overflow-hidden shadow-md transition-all duration-300",
              "bg-white -rotate-6 translate-x-6 translate-y-4 z-0"
            )}
          >
            <Image
              src={image}
              alt="Ticket 3"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Ticket 2 - Middle Layer */}
          <div
            className={cn(
              "absolute w-[20rem] md:w-[33rem] h-[9.5rem] md:h-[15rem] rounded-2xl overflow-hidden shadow-lg transition-all duration-300",
              "bg-white rotate-2 -translate-x-4 translate-y-6 z-10"
            )}
          >
            <Image
              src={image}
              alt="Ticket 2"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Ticket 1 - Top Layer */}
          <div
            className={cn(
              "relative w-[20rem] md:w-[33rem] h-[9.5rem] md:h-[15rem] rounded-2xl overflow-hidden shadow-xl transition-all duration-300",
              "bg-white rotate-0 z-20"
            )}
          >
            <Image
              src={image}
              alt="Ticket 1"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
