"use client";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
// import socket from "./utils/socket";

export default function BookingPage() {
  const [eventId] = useState("68905e4f3e9692e13e37e8e6"); // Replace with real eventId
  const [userId] = useState("688f9c94e8d562c416631962"); // Replace with real userId
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.emit("join-event", eventId);

    socket.on("booking-status", (data) => {
      setStatus(`${data.status.toUpperCase()}: ${data.message}`);
    });

    return () => {
      socket.off("booking-status");
    };
  }, [eventId]);

  const handleBooking = () => {
    socket.emit("request-booking", { eventId, userId });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">🎟️ Book Your Slot</h1>
      <button
        onClick={handleBooking}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
      >
        Request Booking
      </button>
      {status && (
        <div className="mt-4 text-green-600 font-medium">{status}</div>
      )}
    </div>
  );
}
