/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/modules/booking/booking.socket.ts
import { Server, Socket } from "socket.io";
import { enqueueBookingRequest } from "./booking.service";

export const registerBookingHandlers = (socket: Socket, io: Server) => {
  socket.on("join-event", (eventId: string) => {
    socket.join(eventId);
  });

  socket.on("request-booking", async ({ eventId, userId }) => {
    try {
      await enqueueBookingRequest({ eventId, userId, socketId: socket.id });
      socket.emit("booking-status", {
        status: "queued",
        message: "Your booking is in the queue...",
      });
    } catch (err: any) {
      socket.emit("booking-status", {
        status: "error",
        message: err.message,
      });
    }
  });
};
