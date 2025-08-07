"use client";

import socket from "@/app/utils/socket";
import { useAuth } from "@/lib/AuthProviders";
import { useEffect, useState } from "react";

interface BookingStatus {
  status: "idle" | "queued" | "success" | "failed" | "error";
  message: string;
}

interface QueueSerial {
  userId: string;
  serial: number;
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
  totalSlots,
}: BookingPageProps) {
  const { user } = useAuth();

  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({
    status: "idle",
    message: "",
  });
  const [availableSlots, setAvailableSlots] = useState<number>(totalSlots);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [queueSerials, setQueueSerials] = useState<QueueSerial[]>([]);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);

  // Extract user's serial number from queue
  const userSerial =
    queueSerials.find((q) => q.userId === user?.id)?.serial ?? null;

  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join-event", eventId);

    // Listen for booking status update
    socket.on("booking-status", (data: BookingStatus & { userId?: string }) => {
      if (data?.status) {
        setBookingStatus(data);
      }
    });

    // Listen for real-time updates
    socket.on(
      "event-update",
      (data: {
        availableSlots: number;
        queueLength: number;
        userQueuePositions: Record<string, number>;
        queueSerials?: QueueSerial[];
        estimatedWaitTimeSeconds?: Record<string, number>;
      }) => {
        setAvailableSlots(data.availableSlots);

        // Update queue position
        setQueuePosition(data.userQueuePositions?.[user.id] ?? null);
        setQueueSerials(data.queueSerials || []);
        setEstimatedWaitTime(data.estimatedWaitTimeSeconds?.[user.id] ?? 0);
      }
    );

    return () => {
      socket.off("booking-status");
      socket.off("event-update");
    };
  }, [user?.id, eventId]);

  const handleBookingRequest = () => {
    if (bookingStatus.status === "queued" || bookingStatus.status === "success")
      return;

    setBookingStatus({
      status: "queued",
      message: "Booking request sent...",
    });

    socket.emit("request-booking", { eventId, userId: user.id });
  };

  if (!user?.id) {
    return (
      <div className="max-w-lg mx-auto mt-40 text-center text-red-600 font-semibold">
        Please log in to book your slot.
      </div>
    );
  }

  const renderBookingDetails = () => (
    <div className="space-y-2 text-sm text-gray-700">
      <p>
        <strong>Queue Position:</strong> {queuePosition ?? "N/A"}
      </p>
      <p>
        <strong>Serial Number:</strong> {userSerial ?? "N/A"}
      </p>
      <p>
        <strong>Estimated Wait Time:</strong>{" "}
        {estimatedWaitTime > 0
          ? `${Math.ceil(estimatedWaitTime / 60)} min`
          : "N/A"}
      </p>
    </div>
  );

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
            className="w-full py-2 rounded bg-yellow-500 font-semibold  cursor-not-allowed"
          >
            Booking in Queue...
          </button>
        );

      case "success":
        return (
          <button
            disabled
            className="w-full py-2 rounded bg-green-600 font-semibold  cursor-not-allowed"
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
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold "
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

      {bookingStatus.status === "queued" && renderBookingDetails()}
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
