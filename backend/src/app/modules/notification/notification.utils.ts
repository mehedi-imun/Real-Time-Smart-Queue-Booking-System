import { Server } from "socket.io";
export const sendNotification = (
  io: Server,
  socketId: string,
  type: "success" | "error",
  message: string
) => {
  io.to(socketId).emit("booking_notification", { type, message });
};
