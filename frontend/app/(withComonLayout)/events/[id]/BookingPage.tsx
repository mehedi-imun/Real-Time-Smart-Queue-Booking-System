"use client";

import socket from "@/app/utils/socket";
import { useAuth } from "@/lib/AuthProviders";
import { useEffect, useState } from "react";

interface BookingStatus {
  status: "idle" | "queued" | "success" | "failed" | "error";
  message: string;
  userId?: string;
}

interface QueueSerial {
  userId: string;
  serial: number;
}

interface BookingPageProps {
  eventId: string;
  eventTitle: string;
  eventEndsAt?: string;
  totalSlots: number;
  queueType?: string;
}

export default function BookingPage({
  eventId,
  eventTitle,
  totalSlots,
}: BookingPageProps) {
  const { user } = useAuth();

  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({
    status: "idle",
    message: "",
  });
  const [availableSlots, setAvailableSlots] = useState<number>(totalSlots);

  useEffect(() => {
    if (!user?.id) return;

    // Join event room for real-time updates
    socket.emit("join-event", eventId);

    // Booking status updates
    const handleBookingStatus = (data: BookingStatus) => {
      console.log(data);
      if (!data?.userId || data.userId === user.id) {
        setBookingStatus({
          status: data.status,
          message: data.message,
        });
      }
    };

    // Event/queue updates
    const handleEventUpdate = (data: {
      availableSlots: number;
      queueLength: number;
      userQueuePositions: Record<string, number>;
      queueSerials?: QueueSerial[];
      estimatedWaitTimeSeconds?: Record<string, number>;
    }) => {
      setAvailableSlots(data.availableSlots);
    };

    socket.on("booking-status", handleBookingStatus);
    socket.on("event-update", handleEventUpdate);

    return () => {
      socket.off("booking-status", handleBookingStatus);
      socket.off("event-update", handleEventUpdate);
    };
  }, [user?.id, eventId]);

  const handleBookingRequest = () => {
    if (bookingStatus.status === "queued" || bookingStatus.status === "success")
      return;

    setBookingStatus({
      status: "queued",
      message: "Booking request sent...",
    });

    socket.emit("request-booking", { eventId, userId: user?.id });
  };

  if (!user?.id) {
    return (
      <div className="max-w-lg mx-auto mt-40 text-center text-red-600 font-semibold">
        Please log in to book your slot.
      </div>
    );
  }

  const renderBookingButton = () => {
    switch (bookingStatus.status) {
      case "idle":
        return (
          <button
            onClick={handleBookingRequest}
            disabled={availableSlots === 0}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              availableSlots === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {availableSlots === 0 ? "No Slots Available" : "Book Now"}
          </button>
        );

      case "queued":
        return (
          <button
            disabled
            className="w-full py-2 rounded bg-yellow-500 font-semibold cursor-not-allowed"
          >
            Booking in Queue...
          </button>
        );

      case "success":
        return (
          <button
            disabled
            className="w-full py-2 rounded bg-green-600 font-semibold cursor-not-allowed"
          >
            Booking Confirmed
          </button>
        );

      case "failed":
      case "error":
        return (
          <>
            <button
              onClick={handleBookingRequest}
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              Retry Booking
            </button>
            <p className="mt-3 text-red-600 font-medium" role="alert">
              {bookingStatus.message}
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">{eventTitle}</h2>

      {renderBookingButton()}

      {bookingStatus.status !== "failed" &&
        bookingStatus.status !== "error" &&
        bookingStatus.message && (
          <p
            className={`mt-3 font-medium text-center ${
              bookingStatus.status === "success"
                ? "text-green-600"
                : bookingStatus.status === "queued"
                ? "text-yellow-600"
                : "text-gray-800"
            }`}
            role="status"
          >
            {bookingStatus.message}
          </p>
        )}
    </div>
  );
}
