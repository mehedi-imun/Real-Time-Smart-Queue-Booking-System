// src/modules/notification/notification.socket.ts
import { Server, Socket } from "socket.io";

export const registerNotificationHandlers = (socket: Socket, io: Server) => {
  // Future listeners for notifications (if needed)
  socket.on("join_notifications", (userId: string) => {
    const room = `user:${userId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
};
