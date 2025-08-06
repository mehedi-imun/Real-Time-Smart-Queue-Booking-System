"use client";
import { useState } from "react";

export default function BookNowButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/book/${eventId}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Booking confirmed!");
    } catch (err) {
      alert("Failed to book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBook}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      disabled={loading}
    >
      {loading ? "Booking..." : "Book Now"}
    </button>
  );
}
