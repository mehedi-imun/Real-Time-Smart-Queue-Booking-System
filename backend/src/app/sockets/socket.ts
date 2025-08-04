
import { createAdapter } from "@socket.io/redis-adapter";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { redisClient } from "../config/redis.config";
import { registerBookingHandlers } from "../modules/booking/booking.socket";

export let io: Server;

export const initSocketServer = (server: HttpServer) => {
  io = new Server(server, { cors: { origin: "*" } });

  const pub = redisClient.duplicate();
  const sub = redisClient.duplicate();

  Promise.all([pub.connect(), sub.connect()]).then(() => {
    io.adapter(createAdapter(pub, sub));
    console.log("Socket.IO Redis adapter initialized");

    io.on("connection", (socket) => {
      registerBookingHandlers(socket, io);
    });
  });
};
