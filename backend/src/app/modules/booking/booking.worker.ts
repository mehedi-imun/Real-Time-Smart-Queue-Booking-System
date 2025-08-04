/* eslint-disable @typescript-eslint/no-explicit-any */

import { Queue, Worker } from "bullmq";
import { redisConnection } from "../../config/redis.config";
import { io } from "../../sockets/socket";
import { createBooking } from "../booking/booking.service";

interface BookingJobPayload {
  eventId: string;
  userId: string;
  socketId: string;
}

export const bookingQueue = new Queue<BookingJobPayload>("booking-queue", {
  connection: redisConnection,
});

export const bookingWorker = new Worker<BookingJobPayload>(
  "booking-queue",
  async (job) => {
    const { eventId, userId, socketId } = job.data;
    try {
      const booking = await createBooking(eventId, userId);
      io.to(socketId).emit("booking-status", {
        status: "success",
        message: "✅ Booking confirmed!",
        data: booking,
      });
    } catch (err: any) {
      io.to(socketId).emit("booking-status", {
        status: "failed",
        message: err.message || "Booking failed",
      });
    }
  },
  { connection: redisConnection }
);
