import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden pt-12 pb-10 ">
      {/* Background Layer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
          zIndex: 0,
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 xl:px-28 text-gray-400">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          {/* Left */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">QueueBid™</h2>
            <p className="text-sm text-gray-500">
              Smart Queue & Booking System
            </p>
          </div>

          {/* Center Nav */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          {/* Right */}
          <div className="text-sm text-gray-500">
            © {currentYear} QueueBid. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
