"use client";

import socket from "@/app/utils/socket";
import { useAuth } from "@/lib/AuthProviders";
import { useEffect, useState } from "react";
import CountdownTimer from "../CountdownTimer";

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
  eventEndsAt,
  totalSlots,
  queueType,
}: BookingPageProps) {
  const { user } = useAuth();

  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({
    status: "idle",
    message: "",
  });
  const [availableSlots, setAvailableSlots] = useState<number>(totalSlots);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [queueSerials, setQueueSerials] = useState<QueueSerial[]>([]);
  const [estimatedWaitTimeSeconds, setEstimatedWaitTimeSeconds] = useState<number>(0);

  useEffect(() => {
    if (!user || !user.id) return;

    socket.emit("join-event", eventId);

    socket.on("booking-status", (data: BookingStatus & { userId?: string }) => {
      if (!data || !data.status) return;
      setBookingStatus(data);
    });

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

        if (
          data.userQueuePositions &&
          data.userQueuePositions[user.id] !== undefined
        ) {
          setQueuePosition(data.userQueuePositions[user.id]);
        } else {
          setQueuePosition(null);
        }

        if (data.queueSerials) {
          setQueueSerials(data.queueSerials);
        } else {
          setQueueSerials([]);
        }

        if (
          data.estimatedWaitTimeSeconds &&
          data.estimatedWaitTimeSeconds[user.id] !== undefined
        ) {
          setEstimatedWaitTimeSeconds(data.estimatedWaitTimeSeconds[user.id]);
        } else {
          setEstimatedWaitTimeSeconds(0);
        }
      }
    );

    return () => {
      socket.off("booking-status");
      socket.off("event-update");
    };
  }, [eventId, user, user?.id]);

  if (!user || !user.id) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md mt-40 text-center text-red-600">
        Please login to book your slot.
      </div>
    );
  }

  const handleBooking = () => {
    if (bookingStatus.status === "queued" || bookingStatus.status === "success") return;

    setBookingStatus({ status: "queued", message: "Booking request sent..." });
    socket.emit("request-booking", { eventId, userId: user.id });
  };

  const userSerial =
    queueSerials.find((q) => q.userId === user.id)?.serial ?? null;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md mt-40">
      <h1 className="text-2xl font-bold mb-4">{eventTitle}</h1>

      <div className="mb-4 space-y-1">
        <div>
          <strong>Queue Type:</strong> {queueType}
        </div>
        <div>
          <strong>Available Slots:</strong> {availableSlots}
        </div>
        {bookingStatus.status === "queued" && (
          <>
            <div>
              <strong>Your Queue Position:</strong> {queuePosition ?? "N/A"}
            </div>
            <div>
              <strong>Your Serial Number:</strong> {userSerial ?? "N/A"}
            </div>
            <div>
              <strong>Estimated Wait Time:</strong>{" "}
              {estimatedWaitTimeSeconds > 0
                ? `${Math.ceil(estimatedWaitTimeSeconds / 60)} min`
                : "N/A"}
            </div>
          </>
        )}
        <CountdownTimer endsAt={eventEndsAt} />
      </div>

      {bookingStatus.status === "idle" && (
        <button
          disabled={availableSlots === 0}
          onClick={handleBooking}
          className={`w-full py-2 rounded text-white font-semibold ${
            availableSlots === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-live="polite"
        >
          {availableSlots === 0 ? "No Slots Available" : "Book Now"}
        </button>
      )}

      {bookingStatus.status === "queued" && (
        <button
          disabled
          className="w-full py-2 rounded bg-yellow-500 text-white font-semibold cursor-not-allowed"
          aria-live="polite"
        >
          Booking in Queue...
        </button>
      )}

      {bookingStatus.status === "success" && (
        <button
          disabled
          className="w-full py-2 rounded bg-green-600 text-white font-semibold cursor-not-allowed"
          aria-live="polite"
        >
          Booking Confirmed
        </button>
      )}

      {(bookingStatus.status === "failed" || bookingStatus.status === "error") && (
        <>
          <button
            onClick={handleBooking}
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Retry Booking
          </button>
          <p
            className="mt-3 text-red-600 font-medium"
            role="alert"
          >
            {bookingStatus.message}
          </p>
        </>
      )}

      {bookingStatus.status !== "failed" && bookingStatus.status !== "error" && bookingStatus.message && (
        <p
          className={`mt-3 font-medium ${
            bookingStatus.status === "success"
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
