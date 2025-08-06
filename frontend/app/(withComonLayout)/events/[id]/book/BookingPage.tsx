"use client";

import socket from "@/app/utils/socket";
import { useAuth } from "@/lib/AuthProviders";
import { useEffect, useState } from "react";
import CountdownTimer from "../CountdownTimer";

interface BookingStatus {
  status: "queued" | "success" | "failed" | "error" | "";
  message: string;
  position?: number;
  availableSlots?: number;
  bookingData?: any;
}

interface BookingPageProps {
  eventId: string;
  eventTitle: string;
  eventEndsAt: string;
  totalSlots: number;
  queueType: string;
}

export default function BookingPage({
  eventId,
  eventTitle,
  eventEndsAt,
  totalSlots,
  queueType,
}: BookingPageProps) {
  const { user } = useAuth();

  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({
    status: "",
    message: "",
  });
  const [availableSlots, setAvailableSlots] = useState<number>(totalSlots);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !user.id) return;

    socket.emit("join-event", eventId);

    socket.on("booking-status", (data: BookingStatus & { userId?: string }) => {
      if (data && data.status) {
        setBookingStatus(data);
      }
    });

    socket.on(
      "event-update",
      (data: {
        availableSlots: number;
        queueLength: number;
        userQueuePositions: Record<string, number>;
      }) => {
        setAvailableSlots(data.availableSlots);
        if (
          data.userQueuePositions &&
          data.userQueuePositions[user.id] !== undefined
        ) {
          setQueuePosition(data.userQueuePositions[user.id]);
        } else {
          setQueuePosition(null);
        }
      }
    );

    return () => {
      socket.off("booking-status");
      socket.off("event-update");
    };
  }, [eventId, user?.id]);

  // Guard against unauthenticated user
  if (!user || !user.id) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md mt-40 text-center text-red-600">
        Please login to book your slot.
      </div>
    );
  }

  const handleBooking = () => {
    if (bookingStatus.status === "queued") return; // prevent multiple requests

    setBookingStatus({ status: "queued", message: "Booking request sent..." });
    socket.emit("request-booking", { eventId, userId: user.id });
  };
  console.log(eventEndsAt);
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md mt-40">
      <h1 className="text-2xl font-bold mb-4">{eventTitle}</h1>

      <div className="mb-4">
        <strong>Queue Type:</strong> {queueType} <br />
        <strong>Available Slots:</strong> {availableSlots} <br />
        <strong>Your Queue Position:</strong> {queuePosition ?? "N/A"} <br />
        <CountdownTimer endsAt={eventEndsAt} />
      </div>

      <button
        disabled={
          bookingStatus.status === "success" ||
          bookingStatus.status === "queued" ||
          availableSlots === 0
        }
        onClick={handleBooking}
        className={`w-full py-2 rounded text-white font-semibold ${
          bookingStatus.status === "success"
            ? "bg-green-600 cursor-not-allowed"
            : bookingStatus.status === "queued"
            ? "bg-yellow-500 cursor-not-allowed"
            : availableSlots === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        aria-live="polite"
      >
        {bookingStatus.status === "success"
          ? "Booking Confirmed"
          : bookingStatus.status === "queued"
          ? "Booking in Queue..."
          : availableSlots === 0
          ? "No Slots Available"
          : "Book Now"}
      </button>

      {bookingStatus.message && (
        <p
          className={`mt-3 font-medium ${
            bookingStatus.status === "failed" ||
            bookingStatus.status === "error"
              ? "text-red-600"
              : bookingStatus.status === "success"
              ? "text-green-600"
              : bookingStatus.status === "queued"
              ? "text-yellow-600"
              : "text-gray-700"
          }`}
          role="alert"
        >
          {bookingStatus.message}
        </p>
      )}
    </div>
  );
}
